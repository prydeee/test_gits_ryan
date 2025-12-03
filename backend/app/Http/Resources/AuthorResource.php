<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class AuthorResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id'           => $this->id,
            'name'         => $this->name,
            'birth_date'   => $this->birth_date,
            'nationality'  => $this->nationality,
            'biography'    => $this->biography,
            'created_at'   => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'   => $this->updated_at?->format('Y-m-d H:i:s'),

            'books_count'  => $this->whenLoaded('books', fn() => $this->books->count()),
        ];
    }
}