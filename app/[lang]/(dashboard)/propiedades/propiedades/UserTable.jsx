import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ClipboardEdit, Trash2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

const initialUsers = [
  {
    id: 1,
    username: "felixo06",
    email: "felix@gmail.com",
    phone: "3132564568",
  },
  {
    id: 2,
    username: "valentina",
    email: "valentina@gmail.com",
    phone: "3233743870",
  },
  {
    id: 3,
    username: "Carlos",
    email: "carlos@gmail.com",
    phone: "3102037874",
  },
  {
    id: 4,
    username: "maria",
    email: "maria@gmail.com",
    phone: "3156789012",
  },
  {
    id: 5,
    username: "juan",
    email: "juan@gmail.com",
    phone: "3178901234",
  }
]

const UserTable = () => {
  const router = useRouter()
  const [users, setUsers] = useState(initialUsers)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 3

  const handleEdit = (user) => {
    setEditingUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDelete = (userId) => {
    setUsers(users.filter(user => user.id !== userId))
  }

  const handleEditSubmit = (e) => {
    e.preventDefault()
    setUsers(users.map(user => user.id === editingUser.id ? editingUser : user))
    setIsEditDialogOpen(false)
  }

  const handleEditInputChange = (e) => {
    const { name, value } = e.target
    setEditingUser({ ...editingUser, [name]: value })
  }

  const handleCreateOwner = () => {
    router.push('/en/propiedades/propiedades/propietario')
  }

  // Pagination logic
  const totalPages = Math.ceil(users.length / itemsPerPage)
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentUsers = users.slice(indexOfFirstItem, indexOfLastItem)

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Título y botón en contenedor separado */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-semibold">Gestión de Usuarios</h1>
          <Button 
            className="bg-[#3B82F6] hover:bg-[#2563EB]"
            onClick={handleCreateOwner}
          >
            Crear propietario
          </Button>
        </div>
      </div>

      {/* Tabla en contenedor separado */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre de usuario</TableHead>
              <TableHead>Correo</TableHead>
              <TableHead>Teléfono</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(user)} className="text-blue-500">
                    <ClipboardEdit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(user.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 py-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={prevPage}
              disabled={currentPage === 1}
            >
              {"<"}
            </Button>
            <Button variant="outline" size="sm">
              {currentPage}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={nextPage}
              disabled={currentPage === totalPages}
            >
              {">"}
            </Button>
          </div>
        )}
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Usuario</label>
                <Input
                  name="username"
                  value={editingUser?.username || ''}
                  onChange={handleEditInputChange}
                  className="h-12"
                  placeholder="Usuario"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Correo</label>
                <Input
                  name="email"
                  value={editingUser?.email || ''}
                  onChange={handleEditInputChange}
                  className="h-12"
                  placeholder="Correo"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Teléfono</label>
                <Input
                  name="phone"
                  value={editingUser?.phone || ''}
                  onChange={handleEditInputChange}
                  className="h-12"
                  placeholder="Teléfono"
                />
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <Button 
                type="button" 
                variant="secondary" 
                onClick={() => setIsEditDialogOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-[#3B82F6] hover:bg-[#2563EB]"
              >
                Confirmar
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UserTable

