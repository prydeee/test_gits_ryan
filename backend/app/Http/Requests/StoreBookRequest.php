<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => 'required|string|max:200',
            'isbn'           => 'nullable|string|size:13|unique:books,isbn',
            'published_year' => 'nullable|integer|min:1000|max:' . (date('Y') + 5),
            'pages'          => 'nullable|integer|min:1|max:9999',
            'synopsis'       => 'nullable|string|max:5000',
            'author_id'      => 'required|exists:authors,id',
            'publisher_id'   => 'required|exists:publishers,id',
        ];
    }

    public function messages(): array
    {
        return [
            'author_id.required'    => 'Penulis wajib diisi',
            'publisher_id.required' => 'Penerbit wajib diisi',
            'isbn.size'             => 'ISBN harus 13 karakter',
            'isbn.unique'           => 'ISBN sudah digunakan',
        ];
    }
}