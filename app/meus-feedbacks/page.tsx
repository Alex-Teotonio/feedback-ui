// app/dashboard/page.tsx
"use client";

import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import ProtectedRoute from "../../components/ProtectedRoute";
import {
  Spinner,
  Button,
  ModalBody,
  Modal,
  useDisclosure,
  ModalContent,
} from "@nextui-org/react";
import FeedbackCard from "../components/FeedbackCard";
import AddFeedbackForm from "../components/AddFeedbackForm";

interface Feedback {
  _id: string;
  titulo: string;
  descricao: string;
  loja: string;
  produto: string;
  curtidas: number;
  midia: [];
  id_usuario: string;
  createdAt: string;
}

export default function Dashboard() {
  const { token, user } = useContext(AuthContext);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const idUsuario = user?._id;

  const fetchFeedbacks = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/meus-feedbacks/${idUsuario}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const data: Feedback[] = await res.json();
        setFeedbacks(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Erro ao obter feedbacks.");
      }
    } catch (err) {
      console.error(err);
      setError("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/likefeedbacks/${id}/like`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        const updatedFeedback: Feedback = await res.json();
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.map((fb) =>
            fb._id === id ? { ...fb, curtidas: updatedFeedback.curtidas } : fb
          )
        );
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao curtir feedback.");
      }
    } catch (err: any) {
      console.error(err);
      throw err;
    }
  };

  const handleDelete = async (id: string) => {
    if (!id) {
      console.error("Feedback ID is undefined.");
      return;
    }

    const confirmDelete = confirm(
      "Tem certeza que deseja deletar este feedback?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/delete/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        setFeedbacks((prevFeedbacks) =>
          prevFeedbacks.filter((fb) => fb._id !== id)
        );
        alert("Feedback deletado com sucesso!");
      } else {
        const errorData = await res.json();
        throw new Error(errorData.message || "Erro ao deletar feedback.");
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Erro ao deletar feedback.");
    }
  };

  useEffect(() => {
    fetchFeedbacks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ProtectedRoute>
      <div className="p-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Meus Feedbacks</h1>
          <Button
            onClick={fetchFeedbacks}
            disabled={loading}
            variant="faded"
            color="default"
          >
            Atualizar
          </Button>
          <Button onPress={onOpen} color="primary">
            Adicionar Feedback
          </Button>

          <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            placement="top-center"
          >
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalBody>
                    <AddFeedbackForm
                      onFeedbackAdded={fetchFeedbacks}
                      onCloseFeedback={onClose}
                    />
                  </ModalBody>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>

        {loading ? (
          <div className="flex justify-center items-center">
            <Spinner size="lg" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center text-gray-500">
            Nenhum feedback encontrado.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-1 gap-4">
            {feedbacks.map((feedback) => (
              <FeedbackCard
                key={feedback._id}
                feedback={feedback}
                onFetchFeedback={fetchFeedbacks}
                onLike={handleLike}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
