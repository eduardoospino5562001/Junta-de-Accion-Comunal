"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Edit, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

export default function DetalleComitePage() {
  const router = useRouter();

  const [usuarios, setUsuarios] = useState([
    { id: 1, nombreUsuario: "astasd" },
    { id: 2, nombreUsuario: "Usuario 2" },
    { id: 3, nombreUsuario: "Usuario 3" },
    { id: 4, nombreUsuario: "Usuario 4" },
    { id: 5, nombreUsuario: "Usuario 5" },
    { id: 6, nombreUsuario: "Usuario 6" },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const itemsPerPage = 5;
  const totalPages = Math.ceil(usuarios.length / itemsPerPage);

  const paginatedUsers = usuarios.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAgregarMiembro = () => {
    setEditingUser(null);
    setNuevoNombre("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setNuevoNombre("");
    setEditingUser(null);
  };

  const handleConfirmarAgregar = () => {
    if (nuevoNombre.trim()) {
      if (editingUser) {
        setUsuarios((prev) =>
          prev.map((u) =>
            u.id === editingUser.id ? { ...u, nombreUsuario: nuevoNombre } : u
          )
        );
      } else {
        setUsuarios((prev) => [
          ...prev,
          { id: Date.now(), nombreUsuario: nuevoNombre },
        ]);
      }
    }
    handleCloseModal();
  };

  const handleBorrarUsuario = (id) => {
    setUsuarios((prev) => prev.filter((u) => u.id !== id));
  };

  const handleEditarUsuario = (user) => {
    setEditingUser(user);
    setNuevoNombre(user.nombreUsuario);
    setShowModal(true);
  };

  const handleVolver = () => {
    router.replace("/usuariospage");
  };

  const changePage = (newPage) => {
    setCurrentPage(newPage);
  };

  useEffect(() => {
    if (paginatedUsers.length === 0 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [paginatedUsers, currentPage]);

  return (
    <div className="p-4 space-y-4">
      <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Lista de Miembros</h2>
        <div className="flex space-x-4">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
            onClick={handleAgregarMiembro}
          >
            <span>Agregar miembro</span>
          </button>
          <button
            onClick={handleVolver}
            className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Volver
          </button>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Miembros del Comité</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                <th className="px-6 py-3">Nombre de usuario</th>
                <th className="px-6 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{user.nombreUsuario}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex space-x-2">
                      <button
                        className="text-blue-600 hover:text-blue-800"
                        onClick={() => handleEditarUsuario(user)}
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => handleBorrarUsuario(user.id)}
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-center mt-4 space-x-2">
            <button
              onClick={() => changePage(1)}
              disabled={currentPage === 1}
              className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsLeft size={20} />
            </button>
            <button
              onClick={() => changePage(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="px-4 py-2 border rounded-md bg-blue-50 text-blue-600">
              {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => changePage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => changePage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 border rounded-md text-gray-600 hover:bg-gray-100 disabled:opacity-50"
            >
              <ChevronsRight size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4">
        <footer className="text-center text-sm text-gray-600">
          Copyright © Aldeat 2024
        </footer>
      </div>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white p-6 rounded-lg shadow-xl w-96 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-4 text-gray-800">
              {editingUser ? "Editar miembro" : "Agregar miembro"}
            </h3>
            <label className="block mb-2 text-sm font-medium text-gray-700">Nombre de usuario</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={nuevoNombre}
              onChange={(e) => setNuevoNombre(e.target.value)}
              required
            />

            <div className="flex justify-end mt-6 space-x-3">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                onClick={handleCloseModal}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                onClick={handleConfirmarAgregar}
              >
                {editingUser ? "Guardar cambios" : "Agregar"}
              </button>
            </div>

            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
              onClick={handleCloseModal}
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

