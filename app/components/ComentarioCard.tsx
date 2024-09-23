// components/ComentarioCard.tsx

"use client";

import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { FaTrash } from "react-icons/fa";
import { Button, Spinner } from "@nextui-org/react";

interface Comentario {
  _id: string;
  id_usuario: string;
  texto: string;
  createdAt: string;
}

interface ComentarioCardProps {
  comentario: Comentario;
  onDelete: (id: string) => Promise<void>;
}

const ComentarioCard = ({ comentario, onDelete }: ComentarioCardProps) => {
  const { user, token } = useContext(AuthContext);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

  const handleDelete = async () => {
    if (window.confirm("Tem certeza que deseja deletar este comentário?")) {
      setIsDeleting(true);
      await onDelete(comentario._id);
      setIsDeleting(false);
    }
  };

  return (
    <div className="border-b border-gray-200 pb-2 mb-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-700">
          {user?._id === comentario.id_usuario ? "Você" : "Usuário"}
        </span>
        {comentario.id_usuario === user?._id && (
          <Button
            isIconOnly
            size="sm"
            color="danger"
            aria-label="Deletar Comentário"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? <Spinner size="lg" /> : <FaTrash />}
          </Button>
        )}
      </div>
      <p className="text-sm text-gray-600">{comentario.texto}</p>
      <span className="text-xs text-gray-400">
        {new Date(comentario.createdAt).toLocaleString()}
      </span>
    </div>
  );
};

export default ComentarioCard;
