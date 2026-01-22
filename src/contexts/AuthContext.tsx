import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { User, UserRole } from '../types';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  userProfile: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isGuest: boolean;
  isUser: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isActive: boolean;
  canSeePrices: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserProfile({
              uid: user.uid,
              email: user.email!,
              role: data.role as UserRole,
              status: data.status,
              credit: data.credit || 100,
              createdAt: data.createdAt?.toDate() || new Date(),
              displayName: data.displayName,
            });
          } else {
            setUserProfile(null);
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setUserProfile(null);
        }
      } else {
        setUserProfile(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signOut = async () => {
    await firebaseSignOut(auth);
  };

  const isGuest = !currentUser || !userProfile;
  const isUser = userProfile?.role === 'user';
  const isSeller = userProfile?.role === 'seller';
  const isAdmin = userProfile?.role === 'admin';
  const isActive = userProfile?.status === 'active';
  const canSeePrices = !isGuest && isActive;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userProfile,
        loading,
        signIn,
        signOut,
        isGuest,
        isUser,
        isSeller,
        isAdmin,
        isActive,
        canSeePrices,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
