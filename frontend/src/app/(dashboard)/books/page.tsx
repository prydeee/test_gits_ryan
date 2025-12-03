"use client"

import { useState, useEffect } from "react"
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Textarea } from "@/components/ui/textarea"
import api from "@/lib/api"
import { useToastStore } from "@/lib/toast"

type Book = {
  id: number
  title: string
  isbn: string | null
  published_year: number | null
  pages: number | null
  synopsis: string | null
  author: { id: number; name: string }
  publisher: { id: number; name: string }
}

type Author = { id: number; name: string }
type Publisher = { id: number; name: string }

type Pagination = {
  current_page: number
  last_page: number
  per_page: number
  total: number
}

export default function BooksPage() {
  const { addToast } = useToastStore()
  const [books, setBooks] = useState<Book[]>([])
  const [authors, setAuthors] = useState<Author[]>([])
  const [publishers, setPublishers] = useState<Publisher[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0
  })

  const [search, setSearch] = useState("")
  const [authorFilter, setAuthorFilter] = useState("all")
  const [publisherFilter, setPublisherFilter] = useState("all")
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const [open, setOpen] = useState(false)
  const [editingBook, setEditingBook] = useState<Book | null>(null)

  const [form, setForm] = useState({
    title: "", isbn: "", published_year: "", pages: "", synopsis: "", author_id: "", publisher_id: ""
  })

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (search) params.append("search", search)
      if (authorFilter !== "all") params.append("author_id", authorFilter)
      if (publisherFilter !== "all") params.append("publisher_id", publisherFilter)
      params.append("page", page.toString())
  
      const res = await api.get(`/api/books?${params.toString()}`)
      const data = res.data
    
      setBooks(data.data || [])
      setPagination({
        current_page: data.meta.current_page,
        last_page: data.meta.last_page,
        per_page: data.meta.per_page,
        total: data.meta.total
      })
    } catch (err) {
      addToast("Error", "Gagal memuat buku", "destructive")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    api.get("/api/authors").then(res => setAuthors(res.data.data || res.data))
    api.get("/api/publishers").then(res => setPublishers(res.data.data || res.data))
  }, [])

  useEffect(() => {
    fetchBooks()
  }, [search, authorFilter, publisherFilter, page])

  const handleSubmit = async () => {
    try {
      if (editingBook) {
        await api.put(`/api/books/${editingBook.id}`, form)
        addToast("Sukses!", "Buku berhasil diupdate", "success")
      } else {
        await api.post("/api/books", form)
        addToast("Sukses!", "Buku berhasil ditambah", "success")
      }
      setOpen(false)
      setEditingBook(null)
      setForm({ title: "", isbn: "", published_year: "", pages: "", synopsis: "", author_id: "", publisher_id: "" })
      fetchBooks()
    } catch (err: any) {
      addToast("Error", err.response?.data?.message || "Gagal menyimpan", "destructive")
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Yakin hapus?")) return
    try {
      await api.delete(`/api/books/${id}`)
      addToast("Sukses!", "Buku dihapus", "success")
      fetchBooks()
    } catch {
      addToast("Error", "Gagal menghapus", "destructive")
    }
  }

  const openEdit = (book: Book) => {
    setEditingBook(book)
    setForm({
      title: book.title,
      isbn: book.isbn || "",
      published_year: book.published_year?.toString() || "",
      pages: book.pages?.toString() || "",
      synopsis: book.synopsis || "",
      author_id: book.author.id.toString(),
      publisher_id: book.publisher.id.toString(),
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
            Daftar Buku ({pagination.total})
          </CardTitle>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingBook(null)
                setForm({ title: "", isbn: "", published_year: "", pages: "", synopsis: "", author_id: "", publisher_id: "" })
              }}>
                <Plus className="mr-2 h-4 w-4" /> Tambah Buku
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingBook ? "Edit" : "Tambah"} Buku</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div><Label>Judul</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>ISBN</Label><Input value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} /></div>
                  <div><Label>Tahun Terbit</Label><Input value={form.published_year} onChange={e => setForm({ ...form, published_year: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Jumlah Halaman</Label><Input value={form.pages} onChange={e => setForm({ ...form, pages: e.target.value })} /></div>
                </div>
                <div><Label>Sinopsis</Label><Textarea value={form.synopsis} onChange={e => setForm({ ...form, synopsis: e.target.value })} rows={4} /></div>
                <div><Label>Penulis</Label>
                  <Select value={form.author_id} onValueChange={v => setForm({ ...form, author_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih penulis" /></SelectTrigger>
                    <SelectContent>{authors.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Penerbit</Label>
                  <Select value={form.publisher_id} onValueChange={v => setForm({ ...form, publisher_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Pilih penerbit" /></SelectTrigger>
                    <SelectContent>{publishers.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <Button onClick={handleSubmit} className="w-full">Simpan Buku</Button>
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
                placeholder="Cari judul buku..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
                className="pl-10"
              />
            </div>
            <Select value={authorFilter} onValueChange={v => { setAuthorFilter(v); setPage(1) }}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Semua Penulis" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penulis</SelectItem>
                {authors.map(a => <SelectItem key={a.id} value={a.id.toString()}>{a.name}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={publisherFilter} onValueChange={v => { setPublisherFilter(v); setPage(1) }}>
              <SelectTrigger className="w-64"><SelectValue placeholder="Semua Penerbit" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Penerbit</SelectItem>
                {publishers.map(p => <SelectItem key={p.id} value={p.id.toString()}>{p.name}</SelectItem>)}
              </SelectContent>
            </Select>
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
                  <TableHead>Judul</TableHead>
                  <TableHead>Penulis</TableHead>
                  <TableHead>Penerbit</TableHead>
                  <TableHead>Tahun</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      Tidak ada data buku
                    </TableCell>
                  </TableRow>
                ) : (
                  books.map(book => (
                    <TableRow key={book.id}>
                      <TableCell className="font-medium">{book.title}</TableCell>
                      <TableCell>{book.author.name}</TableCell>
                      <TableCell>{book.publisher.name}</TableCell>
                      <TableCell>{book.published_year || "-"}</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="ghost" onClick={() => openEdit(book)}><Edit className="h-4 w-4" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => handleDelete(book.id)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>

            {pagination.last_page > 1 && (
              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-muted-foreground">
                  Menampilkan {books.length} dari {pagination.total} buku
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