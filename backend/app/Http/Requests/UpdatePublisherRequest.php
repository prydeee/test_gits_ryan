<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePublisherRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name'             => 'sometimes|required|string|max:100|unique:publishers,name,' . $this->publisher?->id,
            'city'             => 'nullable|string|max:100',
            'established_year' => 'nullable|integer|min:1000|max:' . date('Y'),
        ];
    }
}