import React, {createContext, useContext, useState} from 'react';

interface UserProfile {
  uid: string;
  email: string;
  xp: number;
  streak: number;
  level: number;
  exercisesCompleted: number;
  lastPracticeDate: string;
}

interface AuthContextType {
  user: any | null;
  userProfile: UserProfile | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({
  children,
}) => {
  const [user, setUser] = useState<any | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

  const login = async (email: string, password: string) => {
    // Mock login for web demo
    const mockUser = {
      uid: 'demo-user-123',
      email: email,
    };
    setUser(mockUser);
    
    const mockProfile: UserProfile = {
      uid: 'demo-user-123',
      email: email,
      xp: 150,
      streak: 5,
      level: 2,
      exercisesCompleted: 12,
      lastPracticeDate: new Date().toISOString().split('T')[0],
    };
    setUserProfile(mockProfile);
  };

  const signup = async (email: string, password: string) => {
    // Mock signup for web demo
    await login(email, password);
  };

  const logout = async () => {
    setUser(null);
    setUserProfile(null);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return;
    
    const updatedProfile = {...userProfile, ...updates};
    setUserProfile(updatedProfile);
  };

  const value = {
    user,
    userProfile,
    login,
    signup,
    logout,
    updateUserProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

