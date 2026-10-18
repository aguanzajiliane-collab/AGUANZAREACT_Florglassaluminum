<?php
namespace App\Http\Resources;
use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class ProductResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'category_id'=>$this->category_id,'category'=>new CategoryResource($this->whenLoaded('category')),'name'=>$this->name,'description'=>$this->description,'type'=>$this->type,'estimated_price'=>$this->estimated_price,'image'=>$this->image,'is_active'=>$this->is_active,'created_at'=>$this->created_at]; } }
