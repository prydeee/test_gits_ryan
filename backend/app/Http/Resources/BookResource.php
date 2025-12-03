<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class BookResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'              => $this->id,
            'title'           => $this->title,
            'isbn'            => $this->isbn,
            'published_year'  => $this->published_year,
            'pages'           => $this->pages,
            'synopsis'        => $this->synopsis,
            'created_at'      => $this->created_at?->format('Y-m-d H:i:s'),
            'updated_at'      => $this->updated_at?->format('Y-m-d H:i:s'),

            // Relasi Author
            'author' => [
                'id'   => $this->whenLoaded('author', fn() => $this->author->id),
                'name' => $this->whenLoaded('author', fn() => $this->author->name),
            ],

            // Relasi Publisher
            'publisher' => [
                'id'   => $this->whenLoaded('publisher', fn() => $this->publisher->id),
                'name' => $this->whenLoaded('publisher', fn() => $this->publisher->name),
            ],
        ];
    }
}