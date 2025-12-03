<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Publisher;
use App\Http\Resources\PublisherResource;
use App\Http\Requests\StorePublisherRequest;
use App\Http\Requests\UpdatePublisherRequest;
use Illuminate\Http\Request;

class PublisherController extends Controller
{
    /**
     * @OA\Get(
     *     path="/api/publishers",
     *     tags={"Publishers"},
     *     summary="List all publishers",
     *     description="Mendapatkan daftar penerbit dengan pagination, search, dan sort",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="search",
     *         in="query",
     *         description="Search by publisher name",
     *         required=false,
     *         @OA\Schema(type="string", example="Gramedia")
     *     ),
     *     @OA\Parameter(
     *         name="sort",
     *         in="query",
     *         description="Sort by field",
     *         required=false,
     *         @OA\Schema(type="string", default="name", enum={"name", "city", "established_year"})
     *     ),
     *     @OA\Parameter(
     *         name="order",
     *         in="query",
     *         description="Sort order",
     *         required=false,
     *         @OA\Schema(type="string", enum={"asc", "desc"}, default="asc")
     *     ),
     *     @OA\Parameter(
     *         name="page",
     *         in="query",
     *         description="Page number for pagination",
     *         required=false,
     *         @OA\Schema(type="integer", default=1, example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success - List of publishers",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="array",
     *                 @OA\Items(
     *                     @OA\Property(property="id", type="integer", example=1),
     *                     @OA\Property(property="name", type="string", example="Gramedia Publisher"),
     *                     @OA\Property(property="city", type="string", example="Jakarta"),
     *                     @OA\Property(property="established_year", type="integer", example=1970),
     *                     @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *                     @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-15 10:30:00")
     *                 )
     *             ),
     *             @OA\Property(property="meta", type="object",
     *                 @OA\Property(property="current_page", type="integer", example=1),
     *                 @OA\Property(property="last_page", type="integer", example=2),
     *                 @OA\Property(property="per_page", type="integer", example=10),
     *                 @OA\Property(property="total", type="integer", example=20)
     *             ),
     *             @OA\Property(property="links", type="object",
     *                 @OA\Property(property="first", type="string", example="http://127.0.0.1:8000/api/publishers?page=1"),
     *                 @OA\Property(property="last", type="string", example="http://127.0.0.1:8000/api/publishers?page=2"),
     *                 @OA\Property(property="prev", type="string", nullable=true, example=null),
     *                 @OA\Property(property="next", type="string", nullable=true, example="http://127.0.0.1:8000/api/publishers?page=2")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized - Token tidak valid atau tidak ada",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Unauthenticated.")
     *         )
     *     )
     * )
     */
    public function index(Request $request)
    {
        $query = Publisher::query()
            ->when($request->search, fn($q) => $q->where('name', 'ilike', "%{$request->search}%"))
            ->orderBy($request->get('sort', 'name'), $request->get('order', 'asc'))
            ->paginate(10);

        return PublisherResource::collection($query);
    }

    /**
     * @OA\Post(
     *     path="/api/publishers",
     *     tags={"Publishers"},
     *     summary="Create new publisher",
     *     description="Membuat penerbit baru",
     *     security={{"bearerAuth":{}}},
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data penerbit baru",
     *         @OA\JsonContent(
     *             required={"name"},
     *             @OA\Property(property="name", type="string", maxLength=100, example="Bentang Pustaka"),
     *             @OA\Property(property="city", type="string", maxLength=100, example="Yogyakarta", nullable=true),
     *             @OA\Property(property="established_year", type="integer", minimum=1000, example=1995, nullable=true)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Publisher created successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=21),
     *                 @OA\Property(property="name", type="string", example="Bentang Pustaka"),
     *                 @OA\Property(property="city", type="string", example="Yogyakarta"),
     *                 @OA\Property(property="established_year", type="integer", example=1995),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-15 10:30:00")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="The name field is required."),
     *             @OA\Property(property="errors", type="object",
     *                 @OA\Property(property="name", type="array",
     *                     @OA\Items(type="string", example="The name field is required.")
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function store(StorePublisherRequest $request)
    {
        return new PublisherResource(Publisher::create($request->validated()));
    }

    /**
     * @OA\Get(
     *     path="/api/publishers/{id}",
     *     tags={"Publishers"},
     *     summary="Show publisher detail",
     *     description="Mendapatkan detail penerbit beserta buku-buku yang diterbitkan",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Publisher ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Success - Publisher detail",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Gramedia Publisher"),
     *                 @OA\Property(property="city", type="string", example="Jakarta"),
     *                 @OA\Property(property="established_year", type="integer", example=1970),
     *                 @OA\Property(property="created_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time", example="2024-01-15 10:30:00"),
     *                 @OA\Property(property="books_count", type="integer", example=15, description="Jumlah buku yang diterbitkan")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Publisher not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Publisher not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function show(Publisher $publisher)
    {
        return new PublisherResource($publisher->load('books'));
    }

    /**
     * @OA\Put(
     *     path="/api/publishers/{id}",
     *     tags={"Publishers"},
     *     summary="Update publisher",
     *     description="Update data penerbit",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Publisher ID",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         description="Data penerbit yang akan diupdate",
     *         @OA\JsonContent(
     *             @OA\Property(property="name", type="string", maxLength=100, example="Gramedia Pustaka Utama"),
     *             @OA\Property(property="city", type="string", maxLength=100, example="Jakarta Pusat"),
     *             @OA\Property(property="established_year", type="integer", minimum=1000, example=1970)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publisher updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="data", type="object",
     *                 @OA\Property(property="id", type="integer", example=1),
     *                 @OA\Property(property="name", type="string", example="Gramedia Pustaka Utama"),
     *                 @OA\Property(property="city", type="string", example="Jakarta Pusat"),
     *                 @OA\Property(property="established_year", type="integer", example=1970),
     *                 @OA\Property(property="created_at", type="string", format="date-time"),
     *                 @OA\Property(property="updated_at", type="string", format="date-time")
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Publisher not found"
     *     ),
     *     @OA\Response(
     *         response=422,
     *         description="Validation error"
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function update(UpdatePublisherRequest $request, Publisher $publisher)
    {
        $publisher->update($request->validated());
        return new PublisherResource($publisher);
    }

    /**
     * @OA\Delete(
     *     path="/api/publishers/{id}",
     *     tags={"Publishers"},
     *     summary="Delete publisher",
     *     description="Hapus penerbit dari database. WARNING: Akan menghapus semua buku yang terkait!",
     *     security={{"bearerAuth":{}}},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="Publisher ID yang akan dihapus",
     *         required=true,
     *         @OA\Schema(type="integer", example=1)
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Publisher deleted successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Publisher deleted")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Publisher not found",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string", example="Publisher not found")
     *         )
     *     ),
     *     @OA\Response(
     *         response=401,
     *         description="Unauthorized"
     *     )
     * )
     */
    public function destroy(Publisher $publisher)
    {
        $publisher->delete();
        return response()->json(['message' => 'Publisher deleted']);
    }
}