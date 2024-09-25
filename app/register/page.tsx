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
import Link from "next/link"; // Importação do Link do Next.js
import { FaEnvelope, FaLock, FaTimesCircle } from "react-icons/fa"; // Importação dos ícones

import { AuthContext } from "../context/AuthContext"; // Ajuste o caminho conforme a estrutura do seu projeto

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
  const [loading, setLoading] = useState<boolean>(false); // Estado para loading

  const handleLogin = async () => {
    // Validação básica
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");

      return;
    }

    setLoading(true); // Inicia o loading

    try {
      const res = await fetch(
        "http://localhost:3005/api/feedback/usuarios/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, senha }),
        },
      );

      const data: LoginResponse = await res.json();

      if (res.ok) {
        setSuccess("Login realizado com sucesso! Redirecionando...");
        setError("");
        // Logar o usuário através do AuthContext
        login(data.token, data.user);
        setTimeout(() => {
          router.push("/dashboard"); // Redirecionar para a página desejada
        }, 2000);
      } else {
        setError(data.message || "Erro ao fazer login.");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão.");
      setSuccess("");
    } finally {
      setLoading(false); // Finaliza o loading
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card isHoverable className="w-full max-w-md" radius="lg" shadow="lg">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-center text-blue-600">
            Login
          </h2>
        </CardHeader>
        <CardBody>
          <Spacer y={1} />

          {/* Campo Email */}
          <Input
            fullWidth
            isClearable
            className="text-gray-700"
            endContent={
              email && (
                <FaTimesCircle
                  className="text-xl text-gray-400 cursor-pointer flex-shrink-0"
                  onClick={() => setEmail("")}
                />
              )
            }
            label="Email"
            placeholder="seuemail@exemplo.com"
            startContent={
              <FaEnvelope className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
            }
            value={email}
            variant="underlined"
            onChange={(e) => setEmail(e.target.value)}
          />

          <Spacer y={1} />

          {/* Campo Senha */}
          <Input
            fullWidth
            isClearable
            className="text-gray-700"
            endContent={
              senha && (
                <FaTimesCircle
                  className="text-xl text-gray-400 cursor-pointer flex-shrink-0"
                  onClick={() => setSenha("")}
                />
              )
            }
            label="Senha"
            placeholder="Sua senha"
            startContent={
              <FaLock className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
            }
            type="password"
            value={senha}
            variant="underlined"
            onChange={(e) => setSenha(e.target.value)}
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
            fullWidth
            color="primary"
            disabled={!email || !senha || loading}
            size="md"
            variant="solid"
            onClick={handleLogin}
          >
            {loading ? "Carregando..." : "Login"}
          </Button>
        </CardBody>
        <CardFooter>
          <p className="text-center text-gray-600">
            Não tem uma conta?{" "}
            <Link className="text-blue-600 hover:underline" href="/register">
              Registrar
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
