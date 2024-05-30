import { User, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { createContext, useCallback, useContext, useState } from "react";
import { FirebaseContext } from "./firebase";

interface AuthContext {
  user: User | null;
  login: (credential: { username: string; password?: string }) => Promise<User>;
}

const AuthContext = createContext<AuthContext | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { app } = useContext(FirebaseContext);

  const [user, setUser] = useState<User | null>(null);

  const login = useCallback(
    async (credential: { username: string; password?: string }) => {
      if (!app) throw new Error("Firebase app not initialized");

      const auth = getAuth(app);

      const email = `${credential.username}@example.com`;
      const password = credential.password || "123456";

      try {
        const userCrendential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

        setUser(userCrendential.user);

        return userCrendential.user;
      } catch (error) {
        throw error;
      }
    },
    [app]
  );

  const authContextReturn: AuthContext = { user: user, login: login };

  return (
    <AuthContext.Provider value={authContextReturn}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
