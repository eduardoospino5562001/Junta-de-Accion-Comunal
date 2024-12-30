"use client";
import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';

export default function PropertiesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    description: "",
  });
  const [sectors, setSectors] = useState([]);
  const [lotes, setLotes] = useState([]);
  const [properties, setProperties] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [selectedSector, setSelectedSector] = useState(null);
  const [selectedLote, setSelectedLote] = useState(null);
  const [currentSectorPage, setCurrentSectorPage] = useState(1);
  const [currentLotePage, setCurrentLotePage] = useState(1);
  const [currentPropertyPage, setCurrentPropertyPage] = useState(1);
  const [searchSector, setSearchSector] = useState("");
  const [searchLote, setSearchLote] = useState("");
  const [searchProperty, setSearchProperty] = useState("");

  const itemsPerPage = 3;

  useEffect(() => {
    const storedSectors = localStorage.getItem("sectors");
    const storedLotes = localStorage.getItem("lotes");
    const storedProperties = localStorage.getItem("properties");
    if (storedSectors) setSectors(JSON.parse(storedSectors));
    if (storedLotes) setLotes(JSON.parse(storedLotes));
    if (storedProperties) setProperties(JSON.parse(storedProperties));
  }, []);

  useEffect(() => {
    localStorage.setItem("sectors", JSON.stringify(sectors));
  }, [sectors]);

  useEffect(() => {
    localStorage.setItem("lotes", JSON.stringify(lotes));
  }, [lotes]);

  useEffect(() => {
    localStorage.setItem("properties", JSON.stringify(properties));
  }, [properties]);

  const handleOpenModal = (type, item = null) => {
    setEditingItem({ type, item });
    if (item) {
      setFormData({
        name: item.name,
        address: item.address,
        description: item.description,
      });
    } else {
      setFormData({ name: "", address: "", description: "" });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({ name: "", address: "", description: "" });
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    const { type, item } = editingItem;
    if (type === "sector") {
      if (item) {
        setSectors((prev) =>
          prev.map((sector) =>
            sector.id === item.id ? { ...sector, ...formData } : sector
          )
        );
      } else {
        setSectors((prev) => [...prev, { ...formData, id: Date.now() }]);
      }
    } else if (type === "lote") {
      if (item) {
        setLotes((prev) =>
          prev.map((lote) =>
            lote.id === item.id ? { ...lote, ...formData } : lote
          )
        );
      } else {
        setLotes((prev) => [...prev, { ...formData, id: Date.now(), sectorId: selectedSector }]);
      }
    } else if (type === "property") {
      if (item) {
        setProperties((prev) =>
          prev.map((property) =>
            property.id === item.id ? { ...property, ...formData } : property
          )
        );
      } else {
        setProperties((prev) => [...prev, { ...formData, id: Date.now(), loteId: selectedLote }]);
      }
    }
    handleCloseModal();
  };

  const handleDelete = (type, id) => {
    if (type === "sector") {
      setSectors((prev) => prev.filter((sector) => sector.id !== id));
    } else if (type === "lote") {
      setLotes((prev) => prev.filter((lote) => lote.id !== id));
    } else if (type === "property") {
      setProperties((prev) => prev.filter((property) => property.id !== id));
    }
  };

  const handleSelectSector = (sectorId) => {
    setSelectedSector(sectorId);
    setSelectedLote(null);
    setCurrentLotePage(1);
  };

  const handleSelectLote = (loteId) => {
    setSelectedLote(loteId);
    setCurrentPropertyPage(1);
  };

  const paginate = (items, currentPage) => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  };

  const totalPages = (items) => Math.ceil(items.length / itemsPerPage);

  const filterItems = (items, searchTerm) => {
    return items.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderList = (type, items, searchTerm, currentPage, setCurrentPage) => {
    const filteredItems = filterItems(items, searchTerm);
    const paginatedItems = paginate(filteredItems, currentPage);

    return (
      <>
        <ul className="space-y-2 text-gray-700 overflow-y-auto max-h-32">
          {paginatedItems.map((item) => (
            <li
              key={item.id}
              className={`py-2 px-3 border rounded-lg flex justify-between items-center cursor-pointer ${
                (type === 'sector' && selectedSector === item.id) || 
                (type === 'lote' && selectedLote === item.id) 
                  ? "bg-blue-100" 
                  : "hover:bg-gray-100"
              }`}
              onClick={() => {
                if (type === 'sector') handleSelectSector(item.id);
                if (type === 'lote') handleSelectLote(item.id);
              }}
            >
              <span>{item.name}</span>
              <div className="flex space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenModal(type, item);
                  }}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(type, item.id);
                  }}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-center mt-4 space-x-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1 border rounded text-gray-600 disabled:opacity-50"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() =>
              setCurrentPage((prev) =>
                Math.min(prev + 1, totalPages(filteredItems))
              )
            }
            disabled={currentPage === totalPages(filteredItems)}
            className="p-1 border rounded text-gray-600 disabled:opacity-50"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Propiedades</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Sectores */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Sectores</h2>
                <button
                  onClick={() => handleOpenModal("sector")}
                  className="bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition-colors"
                >
                  <Plus size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Buscar sector..."
                value={searchSector}
                onChange={(e) => setSearchSector(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {renderList("sector", sectors, searchSector, currentSectorPage, setCurrentSectorPage)}
            </div>

            {/* Lotes */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Lotes</h2>
                <button
                  onClick={() => handleOpenModal("lote")}
                  className={`bg-blue-500 text-white rounded-full p-2 transition-colors ${
                    !selectedSector ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                  disabled={!selectedSector}
                >
                  <Plus size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Buscar lote..."
                value={searchLote}
                onChange={(e) => setSearchLote(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {renderList("lote", lotes.filter((lote) => lote.sectorId === selectedSector), searchLote, currentLotePage, setCurrentLotePage)}
            </div>

            {/* Propiedades */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-700">Propiedades</h2>
                <button
                  onClick={() => handleOpenModal("property")}
                  className={`bg-blue-500 text-white rounded-full p-2 transition-colors ${
                    !selectedLote ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
                  }`}
                  disabled={!selectedLote}
                >
                  <Plus size={20} />
                </button>
              </div>
              <input
                type="text"
                placeholder="Buscar propiedad..."
                value={searchProperty}
                onChange={(e) => setSearchProperty(e.target.value)}
                className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {renderList("property", properties.filter((property) => property.loteId === selectedLote), searchProperty, currentPropertyPage, setCurrentPropertyPage)}
            </div>
          </div>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                {editingItem?.item ? "Editar" : "Agregar"} {editingItem?.type}
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nombre"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Descripción"
                    rows={3}
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
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

