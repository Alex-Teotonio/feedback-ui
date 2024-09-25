// components/EditFeedbackForm.tsx
"use client";

import { useState, useContext } from "react";
import { Button, Input, Textarea, Spacer } from "@nextui-org/react";

import { AuthContext } from "../context/AuthContext";

interface EditFeedbackFormProps {
  feedback: Feedback;
  onFeedbackUpdated: (updatedFeedback: Feedback) => void;
  onCloseFeedback: () => void;
}

interface Feedback {
  _id: string;
  titulo: string;
  descricao: string;
  loja: string;
  produto: string;
  curtidas: number;
  createdAt: string;
  id_usuario: string;
  midia: Array<{ url: string; type: string }>;
}

const EditFeedbackForm = ({
  feedback,
  onFeedbackUpdated,
  onCloseFeedback,
}: EditFeedbackFormProps) => {
  const { token } = useContext(AuthContext);
  const [loja, setLoja] = useState<string>(feedback.loja || "");
  const [produto, setProduto] = useState<string>(feedback.produto || "");
  const [titulo, setTitulo] = useState<string>(feedback.titulo || "");
  const [descricao, setDescricao] = useState<string>(feedback.descricao || "");
  const [files, setFiles] = useState<FileList | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("loja", loja);
      formData.append("produto", produto);
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("media", file);
        });
      }

      const id = feedback._id;
      const response = await fetch(
        `http://localhost:3005/api/feedback/atualizar/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        },
      );

      if (response.ok) {
        const { result } = await response.json();

        console.log(result);
        onFeedbackUpdated(result);
        onCloseFeedback();
      } else {
        const errorData = await response.json();

        setError(errorData.message || "Erro ao atualizar feedback.");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Erro ao atualizar feedback.");
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
      <h2 className="text-2xl font-bold mb-4">Editar Feedback</h2>

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
          Upload de Mídia (Opcional - Adicione novas mídias)
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

      <div className="flex justify-end">
        <Button
          className="mr-2"
          color="danger"
          type="button"
          onPress={onCloseFeedback}
        >
          Cancelar
        </Button>
        <Button color="success" disabled={loading} type="submit">
          {loading ? "Atualizando..." : "Atualizar Feedback"}
        </Button>
      </div>
    </form>
  );
};

export default EditFeedbackForm;
