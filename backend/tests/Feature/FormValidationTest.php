<?php
namespace Tests\Feature;

use App\Models\{User, Category, Product, QuotationRequest};
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class FormValidationTest extends TestCase
{
    use DatabaseTransactions;

    private function account(string $role): User
    {
        return User::create(['name'=>'Validation test','email'=>Str::uuid().'@example.test','password'=>Hash::make(Str::password(24)),'role'=>$role]);
    }
    private function product(): Product
    {
        $category=Category::create(['name'=>'Validation '.Str::uuid(),'description'=>'Temporary test']);
        return Product::create(['category_id'=>$category->id,'name'=>'Validation window','description'=>'Window description','type'=>'Window','estimated_price'=>null,'is_active'=>true]);
    }
    private function quotation(Product $product): array
    {
        return ['project_title'=>'New windows','project_description'=>'Replace windows','project_location'=>'Tubigon','preferred_date'=>null,'estimated_budget'=>null,'items'=>[['product_id'=>$product->id,'quantity'=>1,'specifications'=>'Clear glass']]];
    }
    public function test_authentication_returns_field_errors(): void
    {
        $this->postJson('/api/login',[])->assertStatus(422)->assertJsonValidationErrors(['email','password']);
        $this->postJson('/api/register',['name'=>'','email'=>'invalid','password'=>'short','password_confirmation'=>'different'])
            ->assertStatus(422)->assertJsonValidationErrors(['name','email','password']);
    }
    public function test_category_create_and_update_return_field_errors(): void
    {
        Sanctum::actingAs($this->account('admin'));
        $this->postJson('/api/categories',[])->assertStatus(422)->assertJsonValidationErrors('name');
        $category=$this->product()->category;
        $this->putJson('/api/categories/'.$category->id,['name'=>'','description'=>str_repeat('x',2001)])
            ->assertStatus(422)->assertJsonValidationErrors(['name','description']);
    }
    public function test_product_create_and_update_return_field_errors(): void
    {
        Sanctum::actingAs($this->account('admin'));
        $this->postJson('/api/products',[])->assertStatus(422)->assertJsonValidationErrors(['category_id','name','description','type','is_active']);
        $product=$this->product();
        $this->putJson('/api/products/'.$product->id,['category_id'=>$product->category_id,'name'=>'','type'=>'Window','description'=>'Details','estimated_price'=>-1,'is_active'=>true])
            ->assertStatus(422)->assertJsonValidationErrors(['name','estimated_price']);
    }
    public function test_quotation_create_and_update_return_nested_errors(): void
    {
        Sanctum::actingAs($this->account('customer'));
        $product=$this->product();
        $payload=$this->quotation($product);
        $quote=$this->postJson('/api/quotation-requests',$payload)->assertCreated()->json('data.id');
        $invalid=array_replace($payload,['preferred_date'=>'2000-01-01','items'=>[['product_id'=>$product->id,'quantity'=>0],['product_id'=>$product->id,'quantity'=>1]]]);
        $this->postJson('/api/quotation-requests',$invalid)->assertStatus(422)->assertJsonValidationErrors(['preferred_date','items.0.quantity','items.0.product_id']);
        $this->putJson('/api/quotation-requests/'.$quote,$invalid)->assertStatus(422)->assertJsonValidationErrors(['preferred_date','items.0.quantity']);
    }
    public function test_quotation_status_requires_an_explicit_amount(): void
    {
        $customer=$this->account('customer');Sanctum::actingAs($customer);
        $quote=$this->postJson('/api/quotation-requests',$this->quotation($this->product()))->assertCreated()->json('data.id');
        Sanctum::actingAs($this->account('admin'));
        $this->patchJson('/api/quotation-requests/'.$quote.'/status',['status'=>'quoted','quotation_amount'=>null])
            ->assertStatus(422)->assertJsonValidationErrors('quotation_amount');
        $this->assertSame('pending',QuotationRequest::findOrFail($quote)->status);
    }
    public function test_category_and_product_crud_still_work_with_null_price(): void
    {
        Sanctum::actingAs($this->account('admin'));
        $category=$this->postJson('/api/categories',['name'=>'CRUD '.Str::uuid()])->assertCreated()->json('data.id');
        $payload=['category_id'=>$category,'name'=>'Window','description'=>'Clear glass','type'=>'Sliding','estimated_price'=>null,'is_active'=>true];
        $product=$this->postJson('/api/products',$payload)->assertCreated()->assertJsonPath('data.estimated_price',null)->json('data.id');
        $this->putJson('/api/products/'.$product,array_replace($payload,['name'=>'Updated window']))->assertOk()->assertJsonPath('data.name','Updated window');
        $this->deleteJson('/api/products/'.$product)->assertNoContent();
        $this->putJson('/api/categories/'.$category,['name'=>'Updated '.Str::uuid()])->assertOk();
        $this->deleteJson('/api/categories/'.$category)->assertNoContent();
    }
}
