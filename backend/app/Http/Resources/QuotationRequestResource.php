<?php
namespace App\Http\Resources;
use Illuminate\Http\Request; use Illuminate\Http\Resources\Json\JsonResource;
class QuotationRequestResource extends JsonResource { public function toArray(Request $request): array { return ['id'=>$this->id,'customer'=>new UserResource($this->whenLoaded('user')),'project_title'=>$this->project_title,'project_description'=>$this->project_description,'project_location'=>$this->project_location,'preferred_date'=>$this->preferred_date?->toDateString(),'status'=>$this->status,'estimated_budget'=>$this->estimated_budget,'quotation_amount'=>$this->quotation_amount,'admin_notes'=>$this->when($request->user()?->isAdmin(), $this->admin_notes),'items'=>QuotationRequestItemResource::collection($this->whenLoaded('items')),'created_at'=>$this->created_at]; } }
