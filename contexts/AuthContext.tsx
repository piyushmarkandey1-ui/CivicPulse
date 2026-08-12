"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type AuthRole = "citizen" | "government" | null;

interface UserProfile {
  name: string;
  role: AuthRole;
  reputationScore: number;
  totalReports: number;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: AuthRole;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  role: null,
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<AuthRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        try {
          const docRef = doc(db, "users", firebaseUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data() as UserProfile;
            setProfile(data);
            setRole(data.role || "citizen");
          } else {
            // Default to citizen if document doesn't exist yet (e.g. just signed up)
            setRole("citizen");
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setRole("citizen"); // Fallback
        }
      } else {
        setUser(null);
        setProfile(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, profile, role, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
