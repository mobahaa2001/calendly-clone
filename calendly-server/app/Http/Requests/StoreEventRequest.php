<?php

namespace App\Http\Requests;

use App\Rules\ArrKeysIn;
use Carbon\Carbon;
use Illuminate\Foundation\Http\FormRequest;

class StoreEventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name' => 'required|string',
            'timezone' => 'required|timezone',
            'availabilities' => [new ArrKeysIn(Carbon::getDays())],
            'availabilities.*' => 'array',
            'availabilities.*.*.start' => 'required|date_format:H:i',
            'availabilities.*.*.end' => 'required|date_format:H:i',
        ];
    }
}
