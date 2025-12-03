"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import api from "@/lib/api"
import { useToastStore } from "@/lib/toast"

type Publisher = {
  id: number
  name: string
  city: string | null
  established_year: number | null
  created_at: string
  updated_at: string
}

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function PublishersPage() {
  const { addToast } = useToastStore()
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [editingPublisher, setEditingPublisher] = useState<Publisher | null>(null)

  const [form, setForm] = useState({
    name: "",
    city: "",
    established_year: ""
  })

  const fetchPublishers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      params.append("page", page.toString())

      const res = await api.get(`/api/publishers?${params.toString()}`)
      const data = res.data
      
      setPublishers(data.data || [])
      setPagination({
        current_page: data.meta.current_page,
        last_page: data.meta.last_page,
        per_page: data.meta.per_page,
        total: data.meta.total
      })
    } catch (err) {
      addToast("Error", "Gagal memuat penerbit", "destructive")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPublishers()
  }, [search, page])

  const handleSubmit = async () => {
    try {
      if (editingPublisher) {
        await api.put(`/api/publishers/${editingPublisher.id}`, form)
        addToast("Sukses!", "Penerbit berhasil diupdate", "success")
      } else {
        await api.post("/api/publishers", form)
        addToast("Sukses!", "Penerbit berhasil ditambah", "success")
      }
      setOpen(false)
      setEditingPublisher(null)
      setForm({ name: "", city: "", established_year: "" })
      fetchPublishers()
    } catch (err: any) {
      addToast("Error", err.response?.data?.message || "Gagal menyimpan", "destructive")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus penerbit ini?")) return
    try {
      await api.delete(`/api/publishers/${id}`)
      addToast("Sukses!", "Penerbit dihapus", "success")
      fetchPublishers()
    } catch {
      addToast("Error", "Gagal menghapus", "destructive")
    }
  }

  const openEdit = (publisher: Publisher) => {
    setEditingPublisher(publisher)
    setForm({
      name: publisher.name,
      city: publisher.city || "",
      established_year: publisher.established_year?.toString() || ""
    })
    setOpen(true)
  }

  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, page - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(pagination.last_page, startPage + maxPagesToShow - 1)
    
    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1)
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            Daftar Penerbit ({pagination.total})
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingPublisher(null)
                setForm({ name: "", city: "", established_year: "" })
              }}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Penerbit
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>{editingPublisher ? "Edit" : "Tambah"} Penerbit</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Nama Penerbit</Label>
                  <Input 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    placeholder="Masukkan nama penerbit"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kota</Label>
                    <Input 
                      value={form.city} 
                      onChange={e => setForm({ ...form, city: e.target.value })} 
                      placeholder="Contoh: Jakarta"
                    />
                  </div>
                  <div>
                    <Label>Tahun Berdiri</Label>
                    <Input 
                      type="number"
                      value={form.established_year} 
                      onChange={e => setForm({ ...form, established_year: e.target.value })} 
                      placeholder="Contoh: 2010"
                    />
                  </div>
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Simpan Penerbit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Cari nama penerbit..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(8)].map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
          </div>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Kota</TableHead>
                  <TableHead>Tahun Berdiri</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {publishers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Tidak ada data penerbit
                    </TableCell>
                  </TableRow>
                ) : (
                  publishers.map(publisher => (
                    <TableRow key={publisher.id}>
                      <TableCell className="font-medium">{publisher.name}</TableCell>
                      <TableCell>{publisher.city || "-"}</TableCell>
                      <TableCell>{publisher.established_year || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(publisher)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(publisher.id)}>
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {publishers.length} dari {pagination.total} penerbit
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <ChevronLeft className="h-4 w-4 -ml-2" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {getPageNumbers().map(pageNum => (
                    <Button
                      key={pageNum}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                      className="min-w-[40px]"
                    >
                      {pageNum}
                    </Button>
                  ))}
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={page === pagination.last_page}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage(pagination.last_page)}
                    disabled={page === pagination.last_page}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <ChevronRight className="h-4 w-4 -ml-2" />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}