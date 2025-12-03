<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAuthorRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'        => 'sometimes|required|string|max:100|unique:authors,name,' . $this->author?->id,
            'birth_date'  => 'nullable|date',
            'nationality' => 'nullable|string|max:50',
            'biography'   => 'nullable|string|max:2000',
        ];
    }
}