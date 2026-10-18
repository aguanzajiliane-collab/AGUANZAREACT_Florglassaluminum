<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
class Product extends Model { use HasFactory; protected $fillable=['category_id','name','description','type','estimated_price','image','is_active']; protected function casts(): array { return ['estimated_price'=>'decimal:2','is_active'=>'boolean']; } public function category(): BelongsTo { return $this->belongsTo(Category::class); } public function quotationRequestItems(): HasMany { return $this->hasMany(QuotationRequestItem::class); } }
