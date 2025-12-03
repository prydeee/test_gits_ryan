<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => 'sometimes|required|string|max:200',
            'isbn'           => 'nullable|string|size:13|unique:books,isbn,' . $this->book?->id,
            'published_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 5),
            'pages'          => 'nullable|integer|min:1|max:9999',
            'synopsis'       => 'nullable|string|max:5000',
            'author_id'      => 'sometimes|required|exists:authors,id',
            'publisher_id'   => 'sometimes|required|exists:publishers,id',
        ];
    }
}