<?php

namespace App\Http\Requests;

use App\Models\Account;
use Illuminate\Foundation\Http\FormRequest;

class OauthLoginRequest extends FormRequest
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
        $allowedProviders = implode(',', Account::allowedProviders());
        return [
            'email' => 'required|email:rfc,dns',
            'name' => 'required|string',
            'provider' => "required|in:$allowedProviders",
            'access_token' => 'required|string',
            'refresh_token' => 'required|string',
            'expires_at' => 'required|date'
        ];
    }
}
