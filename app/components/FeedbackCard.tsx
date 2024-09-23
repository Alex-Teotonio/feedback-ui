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
import { useState } from "react";
import { FaTrash, FaPen } from "react-icons/fa";
import EditFeedbackForm from "./EditFeedbackForm";

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
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleLike = async () => {
    setIsLiking(true);
    setMessage(null);
    try {
      console.log(feedback);
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
  return (
    <Card shadow="sm" className="h-full">
      <div className="flex justify-end mt-2 mr-2">
        <Button
          isIconOnly
          size="sm"
          color="default"
          aria-label="Deletar"
          onPress={onOpen}
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
      <CardHeader>
        <p className="text-xl font-semibold">{feedback.titulo}</p>
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
                    className="w-full h-auto rounded max-w-md max-h-48 object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/fallback-image.png";
                    }}
                  />
                ) : (
                  <video
                    src={item.url}
                    controls
                    className="w-full h-auto rounded"
                  />
                )}
              </div>
            ))}
          </div>
        )}
      </CardBody>

      <CardFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <span className="text-sm text-gray-300">Loja: {feedback.loja}</span>
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
