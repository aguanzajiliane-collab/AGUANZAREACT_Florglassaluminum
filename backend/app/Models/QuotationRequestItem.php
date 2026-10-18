<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
class QuotationRequestItem extends Model { use HasFactory; protected $fillable=['quotation_request_id','product_id','quantity','specifications']; public function quotationRequest(): BelongsTo { return $this->belongsTo(QuotationRequest::class); } public function product(): BelongsTo { return $this->belongsTo(Product::class); } }
