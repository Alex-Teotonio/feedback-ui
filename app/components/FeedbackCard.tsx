// components/FeedbackCard.tsx

"use client";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Spinner,
  ModalBody,
  Modal,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";
import { HeartIcon } from "./HeartIcon";
import { useState, useEffect, useContext } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import EditFeedbackForm from "./EditFeedbackForm";
import ComentarioCard from "./ComentarioCard";
import AddComentarioForm from "./AddComentarioForm";
import { AuthContext } from "../context/AuthContext";

interface Feedback {
  _id: string;
  titulo: string;
  descricao: string;
  loja: string;
  produto: string;
  curtidas: number;
  midia: Array<{ url: string; type: string }>;
  id_usuario: string;
  createdAt: string;
}

interface Comentario {
  _id: string;
  id_usuario: string;
  texto: string;
  createdAt: string;
}

export const sanitizeUrl = (url: string) => {
  return url.replace(/^(\.\.\/)+/, "/");
};

interface FeedbackCardProps {
  feedback: Feedback;
  onLike: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onFetchFeedback: () => void;
}

const FeedbackCard = ({
  feedback,
  onLike,
  onDelete,
  onFetchFeedback,
}: FeedbackCardProps) => {
  const { token, user } = useContext(AuthContext);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  // Estados para comentários
  const [comentarios, setComentarios] = useState<Comentario[]>([]);
  const [loadingComentarios, setLoadingComentarios] = useState<boolean>(true);
  const [errorComentarios, setErrorComentarios] = useState<string>("");

  const handleLike = async () => {
    setIsLiking(true);
    setMessage(null);
    try {
      await onLike(feedback._id);
      setMessage({ type: "success", text: "Curtida realizada com sucesso!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Erro ao curtir feedback.",
      });
    } finally {
      setIsLiking(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setMessage(null);
    try {
      await onDelete(feedback._id);
      setMessage({ type: "success", text: "Feedback deletado com sucesso!" });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Erro ao deletar feedback.",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  const fetchComentarios = async () => {
    setLoadingComentarios(true);
    setErrorComentarios("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/${feedback._id}/comentarios`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.ok) {
        const data: Comentario[] = await res.json();
        setComentarios(data);
      } else {
        const errorData = await res.json();
        setErrorComentarios(errorData.message || "Erro ao obter comentários.");
      }
    } catch (err) {
      console.error(err);
      setErrorComentarios("Erro de conexão.");
    } finally {
      setLoadingComentarios(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleComentarioAdded = () => {
    fetchComentarios();
  };

  const handleDeleteComentario = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/comentarios/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        fetchComentarios();
      } else {
        const errorData = await res.json();
        alert(errorData.message || "Erro ao deletar comentário.");
      }
    } catch (error: any) {
      console.error("Erro ao deletar comentário:", error);
      alert(error.message || "Erro ao deletar comentário.");
    }
  };
  return (
    <Card shadow="sm" className="h-full">
      {user?._id === feedback.id_usuario && (
        <div className="flex justify-end mt-2 mr-2">
          <Button
            isIconOnly
            size="sm"
            color="default"
            aria-label="Editar"
            onPress={onOpen}
            className="mr-2"
          >
            <FaPen />
          </Button>
          <Button
            isIconOnly
            size="sm"
            color="default"
            aria-label="Deletar"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="lg" /> : <FaTrash />}
          </Button>
        </div>
      )}
      <CardHeader>
        <div className="flex flex-col">
          <p className="text-xl font-semibold">{feedback.loja}</p>
          <p className="text-xl font-semibold">{feedback.titulo}</p>
        </div>
      </CardHeader>
      <CardBody className="flex-grow">
        <p>{feedback.descricao}</p>
        {feedback.midia && feedback.midia.length > 0 && (
          <div className="mt-4">
            {feedback.midia.map((item, index) => (
              <div key={index} className="mb-2">
                {item.type === "photo" ? (
                  <img
                    src={`http://localhost:3005${sanitizeUrl(item.url)}`}
                    alt={`Mídia ${index + 1}`}
                    className="w-48
                     h-auto rounded max-w-md max-h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/fallback-image.png";
                    }}
                  />
                ) : (
                  <video
                    src={`http://localhost:3005${sanitizeUrl(item.url)}`}
                    controls
                    className="w-full h-auto rounded max-w-md max-h-48 object-cover"
                  />
                )}
              </div>
            ))}
          </div>
        )}
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Comentários:</h3>
          {loadingComentarios ? (
            <Spinner size="sm" />
          ) : errorComentarios ? (
            <div className="text-red-500 text-sm">{errorComentarios}</div>
          ) : comentarios.length === 0 ? (
            <div className="text-gray-500 text-sm">
              Nenhum comentário ainda.
            </div>
          ) : (
            comentarios.map((comentario) => (
              <ComentarioCard
                key={comentario._id}
                comentario={comentario}
                onDelete={handleDeleteComentario}
              />
            ))
          )}
          <div className="mt-4">
            <AddComentarioForm
              feedbackId={feedback._id}
              onComentarioAdded={handleComentarioAdded}
            />
          </div>
        </div>
      </CardBody>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div className="flex items-center mt-2 sm:mt-0">
          <Button
            isIconOnly
            color="danger"
            size="sm"
            aria-label="Curtir"
            onClick={handleLike}
            disabled={isLiking}
            className="mr-2"
          >
            {isLiking ? <Spinner size="lg" /> : <HeartIcon filled={true} />}
          </Button>
          <span className="text-sm text-gray-500">{feedback.curtidas}</span>
        </div>
      </CardFooter>
      {message && (
        <div
          className={`mt-2 text-sm ${
            message.type === "success" ? "text-green-500" : "text-red-500"
          }`}
        >
          {message.text}
        </div>
      )}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="top-center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody>
                <EditFeedbackForm
                  feedback={feedback}
                  onFeedbackUpdated={onFetchFeedback}
                  onCloseFeedback={onClose}
                />
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </Card>
  );
};

export default FeedbackCard;
