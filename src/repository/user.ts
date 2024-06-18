import {
  Firestore,
  QueryDocumentSnapshot,
  SnapshotOptions,
  collection,
  getDocs,
  limit,
  query,
  where,
} from "firebase/firestore";
import { FirestoreRepository } from "./repository";

export interface User {
  id: string;
  email: string;
  level: number;
  name: string;
  // FIXME change to captured point type
  capturedPoints: string[];
}

const userConverter = {
  toFirestore: (user: User) => {
    return {
      email: user.email,
      level: user.level,
      name: user.name,
      capturedPoints: user.capturedPoints,
    };
  },
  fromFirestore: (
    snapshot: QueryDocumentSnapshot<User, Omit<User, "id">>,
    options: SnapshotOptions
  ) => {
    const data = snapshot.data(options);
    return { ...data, id: snapshot.id };
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
}

export default UserRepository;
