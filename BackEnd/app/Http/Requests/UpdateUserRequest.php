<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule; // Add this line
use App\Http\Controllers\Api\BaseController;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
class UpdateUserRequest extends FormRequest
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
        $rules = [];
      //  dd($this->all());
        if ($this->has('name')) {

            $rules['name'] = [
                'string',
                'max:255',
                Rule::unique('users')->ignore($this->user()->id),
            ];
        }

        if ($this->has('email')) {
            $rules['email'] = [
                'email',
                Rule::unique('users')->ignore($this->user()->id),
            ];
        }

        if ($this->filled('password')) {

            $rules['password'] = 'string|min:8|confirmed';
        }

        if ($this->has('phone')) {
            $rules['phone'] = 'regex:/^[0-9]{10,15}$/';
        }

        if ($this->hasFile('image')) {
            $rules['image'] = 'image|mimes:jpeg,png,jpg,gif|max:2048';
        }

        return $rules;

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
