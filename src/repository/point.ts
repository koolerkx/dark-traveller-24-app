import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  query,
  getDocs,
} from "firebase/firestore";
import { FirestoreRepository } from "./repository";

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
}

export default PointRepository;
