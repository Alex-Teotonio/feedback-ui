// components/ProtectedRoute.tsx
"use client";

import { useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthContext } from "../app/context/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!user || !token) {
      // router.push("/login");
    }
  }, [user, token, router]);

  // Enquanto verifica, pode exibir um loading
  if (!user || !token) {
    return <div>Carregando...</div>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
