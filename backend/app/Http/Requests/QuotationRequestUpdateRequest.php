<?php
namespace App\Http\Requests;
class QuotationRequestUpdateRequest extends QuotationRequestStoreRequest { public function authorize(): bool { $quote=$this->route('quotation_request'); return $this->user()?->id === $quote?->user_id && $quote?->status === 'pending'; } }
