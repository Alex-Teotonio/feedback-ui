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
    <Navbar isBordered maxWidth="lg" position="sticky">
      <NavbarBrand>
        <div>TrabalhoBD2</div>
      </NavbarBrand>
      <NavbarContent>
        {token ? (
          <>
            <span>Bem-vindo, {user?.nome}</span>
            <Button color="danger" size="md" variant="flat" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button
              color="primary"
              size="md"
              variant="flat"
              onClick={() => router.push("/login")}
            >
              Login
            </Button>
            <Button
              color="secondary"
              size="md"
              variant="flat"
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
