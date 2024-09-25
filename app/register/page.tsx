// app/register/page.tsx
"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { Input, Button, Spacer, Card, CardBody } from "@nextui-org/react";
import { AuthContext } from "../context/AuthContext";
import Link from "next/link";

import { FaEnvelope, FaLock, FaTimesCircle } from "react-icons/fa";

interface RegisterResponse {
  token: string;
  user: {
    _id: string;
    nome: string;
    email: string;
  };
  message?: string;
}

export default function Register() {
  const router = useRouter();
  const { login } = useContext(AuthContext);
  const [nome, setNome] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [senha, setSenha] = useState<string>("");
  const [confirmarSenha, setConfirmarSenha] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleRegister = async () => {
    // Validação básica
    if (!nome || !email || !senha || !confirmarSenha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    if (senha !== confirmarSenha) {
      setError("As senhas não correspondem.");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}}/usuarios/cadastro`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nome, email, senha }),
        }
      );

      const data: RegisterResponse = await res.json();

      if (res.ok) {
        setSuccess(
          "Registro realizado com sucesso! Redirecionando para o login..."
        );
        setError("");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Erro ao registrar usuário.");
        setSuccess("");
      }
    } catch (err) {
      setError("Erro de conexão.");
      setSuccess("");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen p-4">
      <Spacer y={2} />
      <Card isHoverable className="w-full max-w-md" radius="lg" shadow="lg">
        <CardBody>
          <h2>Registrar</h2>
          <Spacer y={1} />
          <Input
            isClearable
            variant="underlined"
            fullWidth
            label="Nome"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Spacer y={1} />
          <Input
            isClearable
            variant="underlined"
            fullWidth
            label="Email"
            placeholder="seuemail@exemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Spacer y={1} />
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
          <Spacer y={1} />
          <Input
            fullWidth
            isClearable
            className="text-gray-700"
            endContent={
              confirmarSenha && (
                <FaTimesCircle
                  className="text-xl text-gray-400 cursor-pointer flex-shrink-0"
                  onClick={() => setConfirmarSenha("")}
                />
              )
            }
            label="Senha"
            placeholder="Sua senha"
            startContent={
              <FaLock className="text-xl text-gray-400 pointer-events-none flex-shrink-0" />
            }
            type="password"
            value={confirmarSenha}
            variant="underlined"
            onChange={(e) => setConfirmarSenha(e.target.value)}
          />

          {error && (
            <>
              <Spacer y={0.5} />
              <p>{error}</p>
            </>
          )}
          {success && (
            <>
              <Spacer y={0.5} />
              <p>{success}</p>
            </>
          )}
          <Spacer y={1} />
          <Button
            onClick={handleRegister}
            disabled={senha !== confirmarSenha}
            variant="solid" // Utilize a variante desejada
            color="primary" // Utilize a cor desejada
          >
            Registrar
          </Button>
          <Spacer y={1} />
          <p>
            Já tem uma conta? <Link href="/login">Login</Link>
          </p>
        </CardBody>
      </Card>
      <Spacer y={2} />
    </div>
  );
}
