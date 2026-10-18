<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
class QuotationRequestStoreRequest extends FormRequest { public function authorize(): bool { return $this->user()?->role === 'customer'; } public function rules(): array { return ['project_title'=>['required','string','max:150'],'project_description'=>['required','string','max:5000'],'project_location'=>['required','string','max:255'],'preferred_date'=>['nullable','date','after_or_equal:today'],'estimated_budget'=>['nullable','numeric','min:0'],'items'=>['required','array','min:1'],'items.*.product_id'=>['required','distinct','exists:products,id'],'items.*.quantity'=>['required','integer','min:1','max:1000'],'items.*.specifications'=>['nullable','string','max:2000']]; } }
