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
import Link from "next/link";
import { FaEnvelope, FaLock, FaTimesCircle } from "react-icons/fa";
import { title, subtitle } from "@/components/primitives";
import { AuthContext } from "../context/AuthContext";

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
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      setSuccess("");
      return;
    }

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/usuarios/login`,
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
        setError("");
        login(data.token, data.user);
        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      } else {
        setError(data.message || "Erro ao fazer login.");
        setSuccess("");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão.");
      setSuccess("");
    }
  };

  return (
    <div className="flex h-full w-full">
      {/* Seção Esquerda */}
      <div className="hidden md:flex w-1/2  flex-col justify-center items-center">
        <span className="font-bold ">
          <span className={title({ color: "violet" })}>Feed</span>
          <span className={title()}>Back</span>
        </span>
        <div className={`${subtitle({ class: "mt-4" })} text-center max-w-lg`}>
          <span>
            Seu feedback importa! Junte-se a nós para explorar, curtir e
            comentar as melhores avaliações de produtos!
          </span>
        </div>
      </div>

      {/* Seção Direita */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 p-6">
        <Card
          isHoverable
          className="w-full bg-black max-w-md"
          radius="lg"
          shadow="lg"
        >
          <CardHeader className="bg-black">
            <h2 className="flex text-2xl font-semibold ext-gray-300">Login</h2>
          </CardHeader>
          <CardBody className="bg-black h-full">
            <Spacer y={1} />
            <Input
              fullWidth
              type="email"
              isClearable
              className="text-gray-300"
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
              variant="bordered"
              onChange={(e) => setEmail(e.target.value)}
            />

            <Spacer y={6} />

            {/* Campo Senha */}
            <Input
              fullWidth
              isClearable
              className="text-gray-300"
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
              variant="bordered"
              onChange={(e) => setSenha(e.target.value)}
            />
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

            <Spacer y={6} />

            <Button
              color="secondary"
              disabled={!email || !senha}
              size="md"
              variant="bordered"
              onClick={handleLogin}
            >
              Login
            </Button>
          </CardBody>
          <CardFooter className="bg-black">
            <p className="text-center text-gray-300">
              Não tem uma conta?{" "}
              <Link className="text-blue-600 hover:underline" href="/register">
                Registrar
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
