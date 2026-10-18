<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class QuotationRequest extends Model { use HasFactory; public const STATUSES=['pending','quoted','accepted','completed','rejected']; protected $fillable=['user_id','project_title','project_description','project_location','preferred_date','status','estimated_budget','quotation_amount','admin_notes']; protected function casts(): array { return ['preferred_date'=>'date','estimated_budget'=>'decimal:2','quotation_amount'=>'decimal:2']; } public function user(): BelongsTo { return $this->belongsTo(User::class); } public function items(): HasMany { return $this->hasMany(QuotationRequestItem::class); } }
