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
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/api"
import { useToastStore } from "@/lib/toast"

type Author = {
  id: number
  name: string
  birth_date: string | null
  nationality: string | null
  biography: string | null
  created_at: string
  updated_at: string
}

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function AuthorsPage() {
  const { addToast } = useToastStore()
  const [authors, setAuthors] = useState<Author[]>([])
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
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null)

  const [form, setForm] = useState({
    name: "",
    birth_date: "",
    nationality: "",
    biography: ""
  })

  const fetchAuthors = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      params.append("page", page.toString())

      const res = await api.get(`/api/authors?${params.toString()}`)
      const data = res.data
      
      setAuthors(data.data || [])
      setPagination({
        current_page: data.meta.current_page,
        last_page: data.meta.last_page,
        per_page: data.meta.per_page,
        total: data.meta.total
      })
    } catch (err) {
      addToast("Error", "Gagal memuat penulis", "destructive")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAuthors()
  }, [search, page])

  const handleSubmit = async () => {
    try {
      if (editingAuthor) {
        await api.put(`/api/authors/${editingAuthor.id}`, form)
        addToast("Sukses!", "Penulis berhasil diupdate", "success")
      } else {
        await api.post("/api/authors", form)
        addToast("Sukses!", "Penulis berhasil ditambah", "success")
      }
      setOpen(false)
      setEditingAuthor(null)
      setForm({ name: "", birth_date: "", nationality: "", biography: "" })
      fetchAuthors()
    } catch (err: any) {
      addToast("Error", err.response?.data?.message || "Gagal menyimpan", "destructive")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus penulis ini?")) return
    try {
      await api.delete(`/api/authors/${id}`)
      addToast("Sukses!", "Penulis dihapus", "success")
      fetchAuthors()
    } catch {
      addToast("Error", "Gagal menghapus", "destructive")
    }
  }

  const openEdit = (author: Author) => {
    setEditingAuthor(author)
    setForm({
      name: author.name,
      birth_date: author.birth_date || "",
      nationality: author.nationality || "",
      biography: author.biography || ""
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

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-"
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">
            Daftar Penulis ({pagination.total})
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingAuthor(null)
                setForm({ name: "", birth_date: "", nationality: "", biography: "" })
              }}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Penulis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingAuthor ? "Edit" : "Tambah"} Penulis</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div>
                  <Label>Nama Penulis</Label>
                  <Input 
                    value={form.name} 
                    onChange={e => setForm({ ...form, name: e.target.value })} 
                    placeholder="Masukkan nama penulis"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tanggal Lahir</Label>
                    <Input 
                      type="date"
                      value={form.birth_date} 
                      onChange={e => setForm({ ...form, birth_date: e.target.value })} 
                    />
                  </div>
                  <div>
                    <Label>Kewarganegaraan</Label>
                    <Input 
                      value={form.nationality} 
                      onChange={e => setForm({ ...form, nationality: e.target.value })} 
                      placeholder="Contoh: Indonesia"
                    />
                  </div>
                </div>
                <div>
                  <Label>Biografi</Label>
                  <Textarea 
                    value={form.biography} 
                    onChange={e => setForm({ ...form, biography: e.target.value })} 
                    rows={6}
                    placeholder="Tulis biografi singkat penulis..."
                  />
                </div>
                <Button onClick={handleSubmit} className="w-full">
                  Simpan Penulis
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
                placeholder="Cari nama penulis..."
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
                  <TableHead>Tanggal Lahir</TableHead>
                  <TableHead>Kewarganegaraan</TableHead>
                  <TableHead>Biografi</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data penulis
                    </TableCell>
                  </TableRow>
                ) : (
                  authors.map(author => (
                    <TableRow key={author.id}>
                      <TableCell className="font-medium">{author.name}</TableCell>
                      <TableCell>{formatDate(author.birth_date)}</TableCell>
                      <TableCell>{author.nationality || "-"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {author.biography || "-"}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(author)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(author.id)}>
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
                  Menampilkan {authors.length} dari {pagination.total} penulis
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