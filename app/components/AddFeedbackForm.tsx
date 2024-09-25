// components/AddFeedbackForm.tsx
"use client";

import { useState, useContext } from "react";
import { Button, Input, Textarea, Spacer } from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";

interface AddFeedbackFormProps {
  onFeedbackAdded: () => void;
  onCloseFeedback: () => void;
}

const AddFeedbackForm = ({
  onFeedbackAdded,
  onCloseFeedback,
}: AddFeedbackFormProps) => {
  const { token, user } = useContext(AuthContext);
  const [loja, setLoja] = useState<string>("");
  const [produto, setProduto] = useState<string>("");
  const [titulo, setTitulo] = useState<string>("");
  const [descricao, setDescricao] = useState<string>("");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!loja || !produto || !titulo || !descricao) {
      setError("Por favor, preencha todos os campos.");
      setLoading(false);

      return;
    }

    const formData = new FormData();
    const id_usuario = user?._id;

    formData.append("loja", loja);
    formData.append("produto", produto);
    formData.append("titulo", titulo);
    formData.append("descricao", descricao);
    formData.append("id_usuario", id_usuario);

    if (files) {
      Array.from(files).forEach((file) => {
        formData.append("media", file);
      });
    }

    try {
      const res = await fetch(
        "http://localhost:3005/api/feedback/addfeedback",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (res.ok) {
        const data = await res.json();

        console.log("Feedback adicionado com sucesso:", data);
        setLoja("");
        setProduto("");
        setTitulo("");
        setDescricao("");
        setFiles(null);
        onFeedbackAdded();
        onCloseFeedback();
      } else {
        const errorData = await res.json();

        setError(errorData.message || "Erro ao adicionar feedback.");
      }
    } catch (err: any) {
      console.error("Erro ao adicionar feedback:", err);
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFiles(e.target.files);
  };

  return (
    <form
      className="max-w-md mx-auto p-4 rounded shadow"
      onSubmit={handleSubmit}
    >
      <h2 className="text-2xl font-bold mb-4">Adicionar Feedback</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Input
        isClearable
        required
        className="mb-4"
        placeholder="Loja"
        value={loja}
        variant="underlined"
        onChange={(e) => setLoja(e.target.value)}
      />

      <Input
        isClearable
        required
        className="mb-4"
        placeholder="Produto"
        value={produto}
        variant="underlined"
        onChange={(e) => setProduto(e.target.value)}
      />

      <Input
        isClearable
        required
        className="mb-4"
        placeholder="Título"
        value={titulo}
        variant="underlined"
        onChange={(e) => setTitulo(e.target.value)}
      />

      <Textarea
        required
        className="mb-4"
        placeholder="Descrição"
        value={descricao}
        variant="underlined"
        onChange={(e) => setDescricao(e.target.value)}
      />

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="media"
        >
          Upload de Mídia
        </label>
        <input
          multiple
          accept="image/*,video/*"
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
          id="media"
          name="media"
          type="file"
          onChange={handleFileChange}
        />
      </div>

      <Spacer y={1} />

      <Button color="success" disabled={loading} type="submit">
        {loading ? "Enviando..." : "Adicionar Feedback"}
      </Button>
    </form>
  );
};

export default AddFeedbackForm;
