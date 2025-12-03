<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Book;
use App\Http\Resources\BookResource;
use App\Http\Requests\StoreBookRequest;
use App\Http\Requests\UpdateBookRequest;
use Illuminate\Http\Request;

class BookController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/books",
     * tags={"Books"},
     * summary="List all books",
     * description="Mendapatkan daftar buku dengan pagination, search, filter author & publisher, serta sort",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="Search by book title",
     * required=false,
     * @OA\Schema(type="string", example="Laskar")
     * ),
     * @OA\Parameter(
     * name="author_id",
     * in="query",
     * description="Filter by author ID",
     * required=false,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Parameter(
     * name="publisher_id",
     * in="query",
     * description="Filter by publisher ID",
     * required=false,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Parameter(
     * name="sort",
     * in="query",
     * description="Sort by field",
     * required=false,
     * @OA\Schema(type="string", default="title", enum={"title", "published_year", "pages"})
     * ),
     * @OA\Parameter(
     * name="order",
     * in="query",
     * description="Sort order",
     * required=false,
     * @OA\Schema(type="string", enum={"asc", "desc"}, default="asc")
     * ),
     * @OA\Parameter(
     * name="page",
     * in="query",
     * description="Page number for pagination",
     * required=false,
     * @OA\Schema(type="integer", default=1, example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Success - List of books",
     * @OA\JsonContent(
     *     @OA\Property(property="data", type="array",
     *         @OA\Items(
     *             @OA\Property(property="id", type="integer", example=1),
     *             @OA\Property(property="title", type="string", example="Laskar Pelangi"),
     *             @OA\Property(property="isbn", type="string", example="978-979-3062-79-2"),
     *             @OA\Property(property="published_year", type="integer", example=2005),
     *             @OA\Property(property="pages", type="integer", example=529),
     *             @OA\Property(property="synopsis", type="string", example="Kisah perjuangan anak-anak Belitung..."),
     *             @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *             @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *             @OA\Property(property="author", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Andrea Hirata")
     *             ),
     *             @OA\Property(property="publisher", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Bentang Pustaka")
     *             )
     *         )
     *     ),
     *     @OA\Property(property="meta", type="object",
     *         @OA\Property(property="current_page", type="integer", example=1),
     *         @OA\Property(property="last_page", type="integer", example=5),
     *         @OA\Property(property="per_page", type="integer", example=10),
     *         @OA\Property(property="total", type="integer", example=48)
     *     ),
     *     @OA\Property(property="links", type="object",
     *         @OA\Property(property="first", type="string", example="http://127.0.0.1:8000/api/books?page=1"),
     *         @OA\Property(property="last", type="string", example="http://127.0.0.1:8000/api/books?page=5"),
     *         @OA\Property(property="prev", type="string", nullable=true, example=null),
     *         @OA\Property(property="next", type="string", nullable=true, example="http://127.0.0.1:8000/api/books?page=2")
     *     )
     * )
     * ),
     * @OA\Response(
     * response=401,
     * description="Unauthorized - Token tidak valid atau tidak ada",
     * @OA\JsonContent(
     *     @OA\Property(property="message", type="string", example="Unauthenticated.")
     * )
     * )
     * )
     */
    public function index(Request $request)
    {
        $books = Book::with(['author', 'publisher'])
            ->when($request->search, fn($q) => $q->where('title', 'ilike', "%{$request->search}%"))
            ->when($request->author_id, fn($q) => $q->where('author_id', $request->author_id))
            ->when($request->publisher_id, fn($q) => $q->where('publisher_id', $request->publisher_id))
            ->orderBy($request->get('sort', 'title'), $request->get('order', 'asc'))
            ->paginate(10);

        return BookResource::collection($books);
    }

    /**
     * @OA\Post(
     * path="/api/books",
     * tags={"Books"},
     * summary="Create new book",
     * description="Membuat buku baru",
     * security={{"bearerAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * description="Data buku baru",
     * @OA\JsonContent(
     * required={"title","author_id","publisher_id"},
     * @OA\Property(property="title", type="string", maxLength=255, example="Laskar Pelangi"),
     * @OA\Property(property="isbn", type="string", maxLength=20, example="978-979-3062-79-2", nullable=true),
     * @OA\Property(property="published_year", type="integer", minimum=1000, example=2005, nullable=true),
     * @OA\Property(property="pages", type="integer", example=529, nullable=true),
     * @OA\Property(property="synopsis", type="string", example="Novel inspiratif tentang perjuangan pendidikan...", nullable=true),
     * @OA\Property(property="author_id", type="integer", example=1),
     * @OA\Property(property="publisher_id", type="integer", example=1)
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Book created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer", example=51),
     *     @OA\Property(property="title", type="string", example="Laskar Pelangi"),
     *     @OA\Property(property="isbn", type="string", example="978-979-3062-79-2"),
     *     @OA\Property(property="published_year", type="integer", example=2005),
     *     @OA\Property(property="pages", type="integer", example=529),
     *     @OA\Property(property="synopsis", type="string", example="Novel inspiratif..."),
     *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-12-02 15:45:00"),
     *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-12-02 15:45:00"),
     *     @OA\Property(property="author", type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="name", type="string", example="Andrea Hirata")
     *     ),
     *     @OA\Property(property="publisher", type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="name", type="string", example="Bentang Pustaka")
     *     )
     * )
     * )
     * ),
     * @OA\Response(response=422, description="Validation error",
     * @OA\JsonContent(
     *     @OA\Property(property="message", type="string", example="The title field is required."),
     *     @OA\Property(property="errors", type="object")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function store(StoreBookRequest $request)
    {
        $book = Book::create($request->validated());
        return new BookResource($book->load(['author', 'publisher']));
    }

    /**
     * @OA\Get(
     * path="/api/books/{id}",
     * tags={"Books"},
     * summary="Show book detail",
     * description="Mendapatkan detail buku beserta penulis dan penerbit",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Book ID",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Success - Book detail",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="title", type="string", example="Laskar Pelangi"),
     *     @OA\Property(property="isbn", type="string", example="978-979-3062-79-2"),
     *     @OA\Property(property="published_year", type="integer", example=2005),
     *     @OA\Property(property="pages", type="integer", example=529),
     *     @OA\Property(property="synopsis", type="string", example="Novel inspiratif..."),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time"),
     *     @OA\Property(property="author", type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="name", type="string", example="Andrea Hirata")
     *     ),
     *     @OA\Property(property="publisher", type="object",
     *         @OA\Property(property="id", type="integer", example=1),
     *         @OA\Property(property="name", type="string", example="Bentang Pustaka")
     *     )
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Book not found",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Book not found"))
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function show(Book $book)
    {
        return new BookResource($book->load(['author', 'publisher']));
    }

    /**
     * @OA\Put(
     * path="/api/books/{id}",
     * tags={"Books"},
     * summary="Update book",
     * description="Update data buku",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Book ID",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="Data buku yang akan diupdate",
     * @OA\JsonContent(
     *     @OA\Property(property="title", type="string", example="Laskar Pelangi - Edisi Khusus"),
     *     @OA\Property(property="isbn", type="string", example="978-602-03-9999-9"),
     *     @OA\Property(property="published_year", type="integer", example=2023),
     *     @OA\Property(property="pages", type="integer", example=550),
     *     @OA\Property(property="synopsis", type="string"),
     *     @OA\Property(property="author_id", type="integer", example=1),
     *     @OA\Property(property="publisher_id", type="integer", example=2)
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Book updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="title", type="string", example="Laskar Pelangi - Edisi Khusus"),
     *     @OA\Property(property="isbn", type="string", example="978-602-03-9999-9"),
     *     @OA\Property(property="published_year", type="integer", example=2023),
     *     @OA\Property(property="pages", type="integer", example=550),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time"),
     *     @OA\Property(property="author", type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *     ),
     *     @OA\Property(property="publisher", type="object",
     *         @OA\Property(property="id", type="integer"),
     *         @OA\Property(property="name", type="string")
     *     )
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Book not found"),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function update(UpdateBookRequest $request, Book $book)
    {
        $book->update($request->validated());
        return new BookResource($book->load(['author', 'publisher']));
    }

    /**
     * @OA\Delete(
     * path="/api/books/{id}",
     * tags={"Books"},
     * summary="Delete book",
     * description="Hapus buku dari database",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Book ID yang akan dihapus",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Book deleted successfully",
     * @OA\JsonContent(
     *     @OA\Property(property="message", type="string", example="Book deleted")
     * )
     * ),
     * @OA\Response(response=404, description="Book not found",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Book not found"))
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function destroy(Book $book)
    {
        $book->delete();
        return response()->json(['message' => 'Book deleted']);
    }
}