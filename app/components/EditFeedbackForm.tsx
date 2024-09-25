// components/EditFeedbackForm.tsx

"use client";

import { useState, useContext } from "react";
import { Button, Input, Textarea, Spacer } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/modal";
import { FaTrash } from "react-icons/fa";

import { AuthContext } from "../context/AuthContext";

interface EditFeedbackFormProps {
  feedback: Feedback;
  onFeedbackUpdated: (updatedFeedback: Feedback) => void;
  onCloseFeedback: () => void;
}

export const sanitizeUrl = (url: string) => {
  return url.replace(/^(\.\.\/)+/, "/");
};

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
  const [existingMedia, setExistingMedia] = useState<Feedback["midia"]>(
    feedback.midia || []
  );
  const [removedMediaIds, setRemovedMediaIds] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();

      formData.append("loja", loja);
      formData.append("produto", produto);
      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("id_usuario", feedback.id_usuario); // Certifique-se de que 'id_usuario' está sendo enviado

      // Adicionar novas mídias
      if (files) {
        Array.from(files).forEach((file) => {
          formData.append("media", file);
        });
      }

      // Adicionar URLs das mídias a serem removidas
      if (removedMediaIds.length > 0) {
        formData.append("removedMedia", JSON.stringify(removedMediaIds));
      }

      const id = feedback._id;
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/atualizar/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const { result } = await response.json();
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

  const handleRemoveExistingMedia = (index: number) => {
    const mediaToRemove = existingMedia[index];
    // Adiciona a URL da mídia a ser removida
    setRemovedMediaIds([...removedMediaIds, mediaToRemove.url]);
    // Remove a mídia do estado
    setExistingMedia(existingMedia.filter((_, i) => i !== index));
  };

  const handlePreview = (url: string) => {
    setPreviewUrl(url);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewUrl(null);
  };

  return (
    <>
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

        {existingMedia.length > 0 && (
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Mídias Existentes
            </label>
            <div className="flex flex-wrap gap-4">
              {existingMedia.map((media, index) => {
                // Construir a URL da imagem
                const imageUrl = `${process.env.NEXT_PUBLIC_UPLOAD_URL}${sanitizeUrl(media.url)}`;

                return (
                  <div key={index} className="relative">
                    {media.type.startsWith("photo") ? (
                      <img
                        src={imageUrl}
                        alt={`Mídia ${index + 1}`}
                        className="w-48 h-auto rounded max-w-md max-h-48 object-cover"
                        onClick={() => handlePreview(media.url)}
                      />
                    ) : media.type.startsWith("video") ? (
                      <video
                        src={media.url}
                        controls
                        className="w-24 h-24 object-cover rounded cursor-pointer"
                        onClick={() => handlePreview(media.url)}
                      />
                    ) : null}
                    {/* Botão para Remover Mídia */}
                    <button
                      type="button"
                      onClick={() => handleRemoveExistingMedia(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 hover:bg-red-700"
                      aria-label="Remover Mídia"
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Modal de Pré-visualização */}
        <Modal
          isOpen={isPreviewOpen}
          onClose={handleClosePreview}
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <ModalContent>
            <ModalHeader></ModalHeader>
            <ModalBody>
              {previewUrl && previewUrl.endsWith(".mp4") ? (
                <video src={previewUrl} controls className="w-full h-auto" />
              ) : (
                <img
                  src={previewUrl || ""}
                  alt="Pré-visualização"
                  className="object-contain w-full h-auto"
                />
              )}
            </ModalBody>
            <ModalFooter>
              <Button color="danger" onClick={handleClosePreview}>
                Fechar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

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
    </>
  );
};

export default EditFeedbackForm;
