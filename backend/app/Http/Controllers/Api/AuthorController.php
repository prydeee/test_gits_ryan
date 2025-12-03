<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Author;
use App\Http\Resources\AuthorResource;
use App\Http\Requests\StoreAuthorRequest;
use App\Http\Requests\UpdateAuthorRequest;
use Illuminate\Http\Request;

class AuthorController extends Controller
{
    /**
     * @OA\Get(
     * path="/api/authors",
     * tags={"Authors"},
     * summary="List all authors",
     * description="Mendapatkan daftar penulis dengan pagination, search, dan sort",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="search",
     * in="query",
     * description="Search by author name",
     * required=false,
     * @OA\Schema(type="string", example="Andrea")
     * ),
     * @OA\Parameter(
     * name="sort",
     * in="query",
     * description="Sort by field",
     * required=false,
     * @OA\Schema(type="string", default="name", enum={"name", "birth_date"})
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
     * description="Success - List of authors",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="array",
     * @OA\Items(
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="name", type="string", example="Andrea Hirata"),
     *     @OA\Property(property="birth_date", type="string", format="date", example="1967-10-24"),
     *     @OA\Property(property="nationality", type="string", example="Indonesia"),
     *     @OA\Property(property="biography", type="string", example="Penulis novel Laskar Pelangi..."),
     *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *     @OA\Property(property="books_count", type="integer", example=12, description="Jumlah buku yang ditulis")
     * )
     * ),
     * @OA\Property(property="meta", type="object",
     *     @OA\Property(property="current_page", type="integer", example=1),
     *     @OA\Property(property="last_page", type="integer", example=3),
     *     @OA\Property(property="per_page", type="integer", example=10),
     *     @OA\Property(property="total", type="integer", example=25)
     * ),
     * @OA\Property(property="links", type="object",
     *     @OA\Property(property="first", type="string", example="http://127.0.0.1:8000/api/authors?page=1"),
     *     @OA\Property(property="last", type="string", example="http://127.0.0.1:8000/api/authors?page=3"),
     *     @OA\Property(property="prev", type="string", nullable=true, example=null),
     *     @OA\Property(property="next", type="string", nullable=true, example=null)
     * )
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
        $query = Author::query()
            ->when($request->search, fn($q) => $q->where('name', 'ilike', "%{$request->search}%"))
            ->orderBy($request->get('sort', 'name'), $request->get('order', 'asc'))
            ->paginate(10);

        return AuthorResource::collection($query);
    }

    /**
     * @OA\Post(
     * path="/api/authors",
     * tags={"Authors"},
     * summary="Create new author",
     * description="Membuat penulis baru",
     * security={{"bearerAuth":{}}},
     * @OA\RequestBody(
     * required=true,
     * description="Data penulis baru",
     * @OA\JsonContent(
     * required={"name"},
     * @OA\Property(property="name", type="string", maxLength=255, example="Tere Liye"),
     * @OA\Property(property="birth_date", type="string", format="date", example="1979-05-21", nullable=true),
     * @OA\Property(property="nationality", type="string", maxLength=100, example="Indonesia", nullable=true),
     * @OA\Property(property="biography", type="string", nullable=true, example="Penulis best-seller Indonesia...")
     * )
     * ),
     * @OA\Response(
     * response=201,
     * description="Author created successfully",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer", example=31),
     *     @OA\Property(property="name", type="string", example="Tere Liye"),
     *     @OA\Property(property="birth_date", type="string", format="date", example="1979-05-21"),
     *     @OA\Property(property="nationality", type="string", example="Indonesia"),
     *     @OA\Property(property="biography", type="string", example="Penulis best-seller Indonesia..."),
     *     @OA\Property(property="created_at", type="string", format="date-time", example="2024-12-02 16:00:00"),
     *     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-12-02 16:00:00")
     * )
     * )
     * ),
     * @OA\Response(response=422, description="Validation error",
     * @OA\JsonContent(
     *     @OA\Property(property="message", type="string", example="The name field is required."),
     *     @OA\Property(property="errors", type="object")
     * )
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function store(StoreAuthorRequest $request)
    {
        return new AuthorResource(Author::create($request->validated()));
    }

    /**
     * @OA\Get(
     * path="/api/authors/{id}",
     * tags={"Authors"},
     * summary="Show author detail",
     * description="Mendapatkan detail penulis beserta daftar bukunya",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Author ID",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Success - Author detail",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer", example=1),
     *     @OA\Property(property="name", type="string", example="Andrea Hirata"),
     *     @OA\Property(property="birth_date", type="string", format="date"),
     *     @OA\Property(property="nationality", type="string"),
     *     @OA\Property(property="biography", type="string"),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time"),
     *     @OA\Property(property="books_count", type="integer", example=12)
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Author not found",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Author not found"))
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function show(Author $author)
    {
        return new AuthorResource($author->load('books'));
    }

    /**
     * @OA\Put(
     * path="/api/authors/{id}",
     * tags={"Authors"},
     * summary="Update author",
     * description="Update data penulis",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Author ID",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\RequestBody(
     * required=true,
     * description="Data penulis yang akan diupdate",
     * @OA\JsonContent(
     *     @OA\Property(property="name", type="string", example="Andrea Hirata"),
     *     @OA\Property(property="birth_date", type="string", format="date", example="1967-10-24"),
     *     @OA\Property(property="nationality", type="string", example="Indonesia"),
     *     @OA\Property(property="biography", type="string")
     * )
     * ),
     * @OA\Response(
     * response=200,
     * description="Author updated successfully",
     * @OA\JsonContent(
     * @OA\Property(property="data", type="object",
     *     @OA\Property(property="id", type="integer"),
     *     @OA\Property(property="name", type="string"),
     *     @OA\Property(property="birth_date", type="string", format="date"),
     *     @OA\Property(property="nationality", type="string"),
     *     @OA\Property(property="biography", type="string"),
     *     @OA\Property(property="created_at", type="string", format="date-time"),
     *     @OA\Property(property="updated_at", type="string", format="date-time")
     * )
     * )
     * ),
     * @OA\Response(response=404, description="Author not found"),
     * @OA\Response(response=422, description="Validation error"),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function update(UpdateAuthorRequest $request, Author $author)
    {
        $author->update($request->validated());
        return new AuthorResource($author);
    }

    /**
     * @OA\Delete(
     * path="/api/authors/{id}",
     * tags={"Authors"},
     * summary="Delete author",
     * description="Hapus penulis dari database. WARNING: Akan menghapus semua buku terkait!",
     * security={{"bearerAuth":{}}},
     * @OA\Parameter(
     * name="id",
     * in="path",
     * description="Author ID yang akan dihapus",
     * required=true,
     * @OA\Schema(type="integer", example=1)
     * ),
     * @OA\Response(
     * response=200,
     * description="Author deleted successfully",
     * @OA\JsonContent(
     *     @OA\Property(property="message", type="string", example="Author deleted")
     * )
     * ),
     * @OA\Response(response=404, description="Author not found",
     * @OA\JsonContent(@OA\Property(property="message", type="string", example="Author not found"))
     * ),
     * @OA\Response(response=401, description="Unauthorized")
     * )
     */
    public function destroy(Author $author)
    {
        $author->delete();
        return response()->json(['message' => 'Author deleted']);
    }
}