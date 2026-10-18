<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class ProductRequest extends FormRequest { public function authorize(): bool { return $this->user()?->isAdmin() ?? false; } public function rules(): array { return ['category_id'=>['required','exists:categories,id'],'name'=>['required','string','max:150'],'description'=>['required','string','max:5000'],'type'=>['required','string','max:100'],'estimated_price'=>['nullable','numeric','min:0'],'image'=>['nullable','string','max:2048'],'is_active'=>['required','boolean']]; } }
