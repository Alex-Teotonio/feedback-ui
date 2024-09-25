// app/components/Header.tsx
"use client";

import { Navbar, NavbarBrand, NavbarContent, Button } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Header() {
  const router = useRouter();
  const { token, user, logout } = useContext(AuthContext);

  return (
    <Navbar isBordered position="sticky" maxWidth="lg">
      <NavbarBrand>
        <div>TrabalhoBD2</div>
      </NavbarBrand>
      <NavbarContent>
        {token ? (
          <>
            <span>Bem-vindo, {user?.nome}</span>
            <Button variant="flat" color="danger" size="md" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="flat"
              color="primary"
              size="md"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              variant="flat"
              color="secondary"
              size="md"
              onClick={() => router.push("/register")}
            >
              Registrar
            </Button>
          </>
        )}
      </NavbarContent>
    </Navbar>
  );
}
