"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';

export default function PropertiesPage() {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    address: "",
    description: "",
  });
  const [comites, setComites] = useState([]);

  useEffect(() => {
    const loadData = () => {
      const storedComites = localStorage.getItem("comites");
      let parsedComites = storedComites ? JSON.parse(storedComites) : [];

      // Filter out invalid data
      parsedComites = parsedComites.filter(comite => 
        comite && typeof comite === 'object' && comite.name && comite.name.trim() !== 'asdasd'
      );

      // Update localStorage if we removed invalid data
      if (storedComites && parsedComites.length !== JSON.parse(storedComites).length) {
        localStorage.setItem("comites", JSON.stringify(parsedComites));
      }

      setComites(parsedComites);
    };

    loadData();

    const handleStorageChange = (e) => {
      if (e.key === "comites") {
        loadData();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const saveComites = (updatedComites) => {
    try {
      localStorage.setItem("comites", JSON.stringify(updatedComites));
      setComites(updatedComites);
      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      console.error("Error al guardar comités:", error);
    }
  };

  const handleOpenModal = (comite = null) => {
    if (comite) {
      setFormData({ ...comite });
    } else {
      setFormData({ id: null, name: "", address: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({ id: null, name: "", address: "", description: "" });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!formData.name.trim()) {
      alert("El nombre no puede ser vacío");
      return;
    }

    try {
      let updatedComites;
      if (formData.id) {
        // Editing existing comite
        updatedComites = comites.map(comite => 
          comite.id === formData.id ? { ...formData, updatedAt: new Date().toISOString() } : comite
        );
      } else {
        // Creating new comite
        const newComite = {
          ...formData,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        updatedComites = [...comites, newComite];
      }
      saveComites(updatedComites);
      handleCloseModal();
    } catch (error) {
      console.error("Error al guardar comité:", error);
      alert("Hubo un error al guardar el comité. Por favor, intente nuevamente.");
    }
  };

  const handleBorrar = (id) => {
    if (window.confirm("¿Está seguro de que desea eliminar este comité?")) {
      try {
        const updatedComites = comites.filter((comite) => comite.id !== id);
        saveComites(updatedComites);
      } catch (error) {
        console.error("Error al eliminar comité:", error);
        alert("Hubo un error al eliminar el comité. Por favor, intente nuevamente.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Lista de Comités</h1>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <Plus size={20} />
            <span>Crear Comité</span>
          </button>
        </div>

        {/* Tabla */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Comités Registrados</h2>
            {comites.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No hay comités registrados</p>
                <button
                  onClick={() => handleOpenModal()}
                  className="mt-4 text-blue-600 hover:underline flex items-center justify-center space-x-2 mx-auto"
                >
                  <Plus size={20} />
                  <span>Crear primer comité</span>
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      <th className="px-6 py-3">Nombre</th>
                      <th className="px-6 py-3">Dirección</th>
                      <th className="px-6 py-3">Descripción</th>
                      <th className="px-6 py-3">Fecha de Creación</th>
                      <th className="px-6 py-3">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {comites.map((comite) => (
                      <tr key={comite.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">{comite.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{comite.address || "N/A"}</td>
                        <td className="px-6 py-4">{comite.description || "N/A"}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {comite.createdAt ? new Date(comite.createdAt).toLocaleDateString() : "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <Link 
                              href={`/usuariospage/detalleComite?comiteId=${comite.id}`}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye size={20} />
                            </Link>
                            <button 
                              onClick={() => handleOpenModal(comite)}
                              className="text-green-600 hover:text-green-800"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => handleBorrar(comite.id)}
                              className="text-red-600 hover:text-red-800"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              <h2 className="text-2xl font-bold mb-6 text-gray-800">
                {formData.id ? 'Editar Comité' : 'Crear Comité'}
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre del comité"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Dirección
                  </label>
                  <input
                    type="text"
                    id="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Dirección"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
                    placeholder="Descripción"
                  />
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  {formData.id ? 'Guardar Cambios' : 'Crear Comité'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

