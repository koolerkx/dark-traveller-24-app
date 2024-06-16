import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import PointRepository from "../repository/point";
import { useFirebase } from "./firebase";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";

interface RepositoryContext {
  pointRepository: PointRepository | null;
}

export const RepositoryContext = createContext<RepositoryContext>({
  pointRepository: null,
});

export const RepositoryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [db, setDb] = useState<Firestore | null>(null);
  const [pointRepository, setPointRepository] =
    useState<PointRepository | null>(null);

  const { app } = useFirebase();

  useEffect(
    useCallback(() => {
      if (!app) return;

      console.log(process.env.FIREBASE_FIRESTORE_EMULATOR_HOST);
      const db = getFirestore(app);

      if (
        process.env.FIRESTORE_EMULATOR == "true" &&
        !!process.env.FIREBASE_FIRESTORE_EMULATOR_HOST
      ) {
        connectFirestoreEmulator(
          db,
          process.env.FIREBASE_FIRESTORE_EMULATOR_HOST,
          8080
        );
      }

      setDb(db);
      setPointRepository(new PointRepository(db));
    }, [app, getFirestore, setDb, setPointRepository]),
    [app]
  );

  const returnValue = {
    pointRepository,
  };

  return (
    <RepositoryContext.Provider value={returnValue}>
      {children}
    </RepositoryContext.Provider>
  );
};

export const useRepository = () => {
  const context = useContext(RepositoryContext);
  if (!context) {
    throw new Error("useRepository must be used within a RepositoryProvider");
  }
  return context;
};
