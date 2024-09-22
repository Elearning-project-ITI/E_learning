<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use App\Http\Controllers\Api\BaseController;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class StoreUserRequest extends FormRequest
{
    protected $baseController;

    public function __construct(BaseController $baseController)
    {
        $this->baseController = $baseController;
    } 
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255|unique:users,name',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'required|regex:/^[0-9]{10,15}$/',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',  // Image is now required

        ];
    }
    public function messages()
    {
        return [
            'name.unique' => 'This name is already registered.',
            'email.unique' => 'This email address is already registered.',
            'password.confirmed' => 'The password confirmation does not match.',
            'phone.regex' => 'The phone number must be between 10 and 15 digits.'
        ];
    }
    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            $this->baseController->sendError($validator->errors()->all())
        );
    }
}
