import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  getDocs,
  query,
} from "firebase/firestore";
import { FirestoreRepository } from "./repository";
import { User, userConverter } from "./user";
import { isAfter } from "date-fns";

export interface Point {
  id: string;
  point: string;
  description: string;
  heroImage: string | null;
  location: {
    lat: number;
    long: number;
  };
  isPublic: boolean;
}

export interface PointWithStatus extends Point {
  capturedInfo: {
    capturedAt: Date | null;
    capturedByUser: User | null;
    expiredAt: Date | null;
  } | null;
}

export interface CapturedPoint {
  id: string;
  pointId: string;
  userId: string;
  userName: string;
  level: number;
  createdAt: Date;
  expiredAt: Date | null;
}

const pointConverter = {
  toFirestore: (point: Point) => {
    return {
      point: point.point,
      description: point.description,
      heroImage: point.heroImage,
      location: point.location,
      isPublic: point.isPublic,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<Point, Omit<Point, "id">>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id };
  },
};

class PointRepository extends FirestoreRepository {
  private userRef = collection(this.db, "users").withConverter(userConverter);
  private pointsRef = collection(this.db, "points").withConverter(
    pointConverter
  );

  constructor(db: Firestore) {
    super(db);
  }

  public async getPoints(): Promise<Point[]> {
    const _query = await query(this.pointsRef);
    const querySnapshot = await getDocs(_query);

    const points = querySnapshot.docs.map((it) => it.data());
    return points;
  }

  public async getPointsWithCapturedInfo(): Promise<PointWithStatus[]> {
    const _userQuery = await query(this.userRef);
    const usersQuerySnapshot = await getDocs(_userQuery);
    const users = usersQuerySnapshot.docs.map((it) => it.data());
    // make user map by id
    const userMap = users.reduce<Record<string, User>>((acc, cur) => {
      return { ...acc, [cur.id]: cur };
    }, {});

    const capturedPoint = users
      .flatMap((it) => it.capturedPoints)
      .reduce<Record<string, CapturedPoint>>((acc, cur) => {
        const isOverride = isAfter(cur.createdAt, acc[cur.pointId]?.createdAt);

        return {
          ...acc,
          [cur.pointId]:
            isOverride || !acc[cur.pointId] ? cur : acc[cur.pointId],
        };
      }, {});

    const _pointQuery = await query(this.pointsRef);
    const pointsQuerySnapshot = await getDocs(_pointQuery);
    const points = pointsQuerySnapshot.docs.map((it) => it.data());

    const result = points.map((it) => ({
      ...it,
      capturedInfo: !!capturedPoint[it.id]
        ? {
            capturedAt: capturedPoint[it.id].createdAt,
            capturedByUser: userMap[capturedPoint[it.id].userId],
            expiredAt: capturedPoint[it.id].expiredAt,
          }
        : null,
    }));

    return result;
  }
}

export default PointRepository;
