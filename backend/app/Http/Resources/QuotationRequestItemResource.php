<?php
namespace App\Http\Resources;
use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class QuotationRequestItemResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'product'=>new ProductResource($this->whenLoaded('product')),'product_id'=>$this->product_id,'quantity'=>$this->quantity,'specifications'=>$this->specifications]; } }
