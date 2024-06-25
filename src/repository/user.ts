import { differenceInSeconds } from "date-fns";
import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  getDocs,
  limit,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { CapturedPointInCooldownError } from "../error";
import { CapturedPoint } from "./point";
import { FirestoreRepository } from "./repository";

// 5 minutes
export const CAPTURED_POINT_COOLDOWN_SECONDS = 60;

export interface User {
  id: string;
  email: string;
  level: number;
  name: string;
  capturedPoints: CapturedPoint[];
}

const parseCapturedPoint = {
  fromFirestore: (point: CapturedPoint): CapturedPoint => ({
    ...point,
    createdAt: new Date(point.createdAt),
    expiredAt: point.expiredAt ? new Date(point.expiredAt) : null,
  }),
  toFirestore: (
    point: Omit<CapturedPoint, "id">
  ): Record<
    keyof Omit<CapturedPoint, "id">,
    string | number | boolean | null
  > => ({
    pointId: point.pointId,
    userId: point.userId,
    userName: point.userName,
    level: point.level,
    createdAt: point.createdAt.toISOString(),
    expiredAt: point.expiredAt ? point.expiredAt.toISOString() : null,
  }),
};

const userConverter = {
  toFirestore: (user: User) => {
    return {
      email: user.email,
      level: user.level,
      name: user.name,
      capturedPoints: user.capturedPoints.map(parseCapturedPoint.toFirestore),
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<User, Omit<User, "id">>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return {
      ...data,
      capturedPoints: data.capturedPoints.map(parseCapturedPoint.fromFirestore),
      id: snapshot.id,
    };
  },
};

class UserRepository extends FirestoreRepository {
  private userRef = collection(this.db, "users").withConverter(userConverter);

  constructor(db: Firestore) {
    super(db);
  }

  public async getUser(email: string): Promise<User> {
    const _query = query(this.userRef, where("email", "==", email), limit(1));
    const querySnapshot = await getDocs(_query);

    const users = await querySnapshot.docs.map((it) => it.data());

    return users[0];
  }

  public async capturePoint(user: User, pointId: string): Promise<void> {
    const capturedPoint = await runTransaction(this.db, async (transaction) => {
      const now = new Date();

      const usersQuerySnapshot = await getDocs(this.userRef);

      // Clear last captured point
      const users = await usersQuerySnapshot.docs.map((it) => it.data());

      const allCapturedPoints = users.flatMap((it) => it.capturedPoints);
      const lastCapturedPoint = allCapturedPoints
        .filter((it) => it.pointId === pointId)
        .find((it) => it.expiredAt === null);

      // Check last captured point is captured over 300 seconds
      const secondsSinceCaptured = differenceInSeconds(
        now,
        lastCapturedPoint?.createdAt ? lastCapturedPoint?.createdAt : 0
      );

      const isLastCaptureExpired =
        secondsSinceCaptured > CAPTURED_POINT_COOLDOWN_SECONDS;

      if (!isLastCaptureExpired) {
        throw new CapturedPointInCooldownError(secondsSinceCaptured);
      }

      // Clear other user last captured point
      if (!!lastCapturedPoint && lastCapturedPoint.userId !== user.id) {
        const lastCapturedPointUserSnapshot = usersQuerySnapshot.docs.find(
          (it) => it.id === lastCapturedPoint.userId
        );

        if (!!lastCapturedPointUserSnapshot) {
          const updatedCapturedPoint = lastCapturedPointUserSnapshot
            .data()
            .capturedPoints.map((it) =>
              it.id === lastCapturedPoint.id ? { ...it, expiredAt: now } : it
            )
            .map(parseCapturedPoint.toFirestore);

          transaction.update(lastCapturedPointUserSnapshot.ref, {
            capturedPoints: updatedCapturedPoint,
          });
        }
      }

      // Insert New Captured Point (and clear self last captured point)
      const currentUserSnapshot = usersQuerySnapshot.docs.find(
        (it) => it.id === user.id
      );

      if (!currentUserSnapshot) throw new Error("User not found");

      transaction.update(currentUserSnapshot.ref, {
        capturedPoints: [
          ...currentUserSnapshot
            .data()
            .capturedPoints.map((it) =>
              it.id === lastCapturedPoint?.id ? { ...it, expiredAt: now } : it
            )
            .map(parseCapturedPoint.toFirestore),
          parseCapturedPoint.toFirestore({
            pointId: pointId,
            userId: user.id,
            userName: user.name,
            level: user.level,
            createdAt: now,
            expiredAt: null,
          }),
        ],
      });
    });
  }
}

export default UserRepository;
