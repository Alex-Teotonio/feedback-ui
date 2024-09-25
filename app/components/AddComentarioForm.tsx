// components/AddComentarioForm.tsx

"use client";

import React, { useState, useContext } from "react";
import { Button, Textarea, Spinner } from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";

interface AddComentarioFormProps {
  feedbackId: string;
  onComentarioAdded: () => void;
}

const AddComentarioForm = ({
  feedbackId,
  onComentarioAdded,
}: AddComentarioFormProps) => {
  const { token } = useContext(AuthContext);
  const [texto, setTexto] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (texto.trim() === "") {
      setError("O comentário não pode estar vazio.");

      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:3005/api/feedback/comentarios/${feedbackId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ texto }),
        },
      );

      if (res.ok) {
        setTexto("");
        onComentarioAdded();
      } else {
        const errorData = await res.json();

        setError(errorData.message || "Erro ao adicionar comentário.");
      }
    } catch (err: any) {
      console.error(err);
      setError("Erro de conexão.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
      <Textarea
        required
        label="Adicionar Comentário"
        placeholder="Escreva seu comentário aqui..."
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
      />
      {error && <span className="text-red-500 text-sm">{error}</span>}
      <Button disabled={isSubmitting} type="submit">
        {isSubmitting ? <Spinner size="sm" /> : "Enviar Comentário"}
      </Button>
    </form>
  );
};

export default AddComentarioForm;
