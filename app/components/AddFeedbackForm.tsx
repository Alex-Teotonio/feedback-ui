// components/AddFeedbackForm.tsx
"use client";

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { Button, Input, Textarea, Spacer } from "@nextui-org/react";

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
        }
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
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 rounded shadow"
    >
      <h2 className="text-2xl font-bold mb-4">Adicionar Feedback</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <Input
        isClearable
        variant="underlined"
        placeholder="Loja"
        value={loja}
        onChange={(e) => setLoja(e.target.value)}
        required
        className="mb-4"
      />

      <Input
        isClearable
        variant="underlined"
        placeholder="Produto"
        value={produto}
        onChange={(e) => setProduto(e.target.value)}
        required
        className="mb-4"
      />

      <Input
        isClearable
        variant="underlined"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="mb-4"
      />

      <Textarea
        variant="underlined"
        placeholder="Descrição"
        value={descricao}
        onChange={(e) => setDescricao(e.target.value)}
        required
        className="mb-4"
      />

      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="media"
        >
          Upload de Mídia
        </label>
        <input
          type="file"
          id="media"
          name="media"
          multiple
          accept="image/*,video/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
          "
        />
      </div>

      <Spacer y={1} />

      <Button type="submit" disabled={loading} color="success">
        {loading ? "Enviando..." : "Adicionar Feedback"}
      </Button>
    </form>
  );
};

export default AddFeedbackForm;
