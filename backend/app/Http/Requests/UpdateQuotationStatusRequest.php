<?php
namespace App\Http\Requests;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
class UpdateQuotationStatusRequest extends FormRequest { public function authorize(): bool { return $this->user()?->isAdmin() ?? false; } public function rules(): array { return ['status'=>['required', Rule::in(['quoted','completed','rejected'])],'quotation_amount'=>['required_if:status,quoted','nullable','numeric','min:0'],'admin_notes'=>['nullable','string','max:5000']]; } }
