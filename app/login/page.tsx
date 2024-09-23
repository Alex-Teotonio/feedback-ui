// app/login/page.tsx
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import {
  Input,
  Button,
  Spacer,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
} from "@nextui-org/react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";
import { FaEnvelope, FaLock, FaTimesCircle } from "react-icons/fa";

interface LoginResponse {
  token: string;
  user: {
    _id: string;
    nome: string;
    email: string;
  };
  message?: string;
}

export default function Login() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleLogin = async () => {
    // Validação básica
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    try {
      const res = await fetch(
        "http://localhost:3005/api/feedback/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        }
      );

      const data: LoginResponse = await res.json();

      if (res.ok) {
        setSuccess("Login realizado com sucesso! Redirecionando...");
        login(data.token, data.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Erro ao fazer login.");
        setSuccess("");
      }
    } catch (err) {
      setError("Erro de conexão.");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Card shadow="lg" radius="lg" isHoverable className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-gray-300">
            Login
          </h2>
        </CardHeader>
        <CardBody>
          <Spacer y={1} />
          <Input
            isClearable
            variant="underlined"
            fullWidth
            label="Email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            startContent={
              <FaEnvelope className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              email && (
                <FaTimesCircle
                  className="text-xl text-gray-400 cursor-pointer flex-shrink-0"
                  onClick={() => setEmail("")}
                />
              )
            }
            className="text-gray-700"
          />

          <Spacer y={1} />

          {/* Campo Senha */}
          <Input
            type="password"
            isClearable
            variant="underlined"
            fullWidth
            label="Senha"
            placeholder="Sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            startContent={
              <FaLock className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
            }
            endContent={
              senha && (
                <FaTimesCircle
                  className="text-xl text-gray-400 cursor-pointer flex-shrink-0"
                  onClick={() => setSenha("")}
                />
              )
            }
            className="text-gray-700"
          />

          {/* Mensagens de Erro e Sucesso */}
          {error && (
            <>
              <Spacer y={0.5} />
              <p className="text-red-500 text-center">{error}</p>
            </>
          )}
          {success && (
            <>
              <Spacer y={0.5} />
              <p className="text-green-500 text-center">{success}</p>
            </>
          )}

          <Spacer y={1} />

          {/* Botão de Login */}
          <Button
            onClick={handleLogin}
            disabled={!email || !senha}
            variant="solid"
            color="primary"
            size="md"
            fullWidth
          >
            Login
          </Button>
        </CardBody>
        <CardFooter>
          <p className="text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link href="/register" className="text-blue-600 hover:underline">
              Registrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
