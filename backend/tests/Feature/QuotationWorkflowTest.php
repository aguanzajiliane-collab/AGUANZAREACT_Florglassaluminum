<?php
namespace Tests\Feature;

use App\Models\{User, Product, QuotationRequest};
use Illuminate\Foundation\Testing\DatabaseTransactions;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Tests\TestCase;

// Real MySQL/API execution, with every test rolled back. No migrations or seeders.
class QuotationWorkflowTest extends TestCase
{
    use DatabaseTransactions;

    private function loginAs(string $role): array
    {
        $password=Str::password(24);
        $user=User::create(['name'=>'Rollback-only workflow test','email'=>Str::uuid().'@example.test','password'=>Hash::make($password),'role'=>$role]);
        $this->app['auth']->forgetGuards();
        $response=$this->withHeader('Authorization','')->postJson('/api/login',['email'=>$user->email,'password'=>$password]);
        $response->assertOk()->assertJsonPath('user.role',$role);
        return [$user,$response->json('token')];
    }
    private function token(string $token): self
    {
        $this->app['auth']->forgetGuards();
        return $this->withToken($token);
    }
    private function payload(): array
    {
        $product=Product::where('is_active',true)->firstOrFail();
        return ['project_title'=>'AUTOMATED WORKFLOW TEST - ROLLED BACK','project_description'=>'Demonstration data for automated testing only. Never retained.','project_location'=>'Test location','preferred_date'=>null,'estimated_budget'=>null,'items'=>[['product_id'=>$product->id,'quantity'=>1,'specifications'=>'Test specification']]];
    }
    private function submit(string $token): int
    {
        $payload=$this->payload();
        $response=$this->token($token)->postJson('/api/quotation-requests',$payload);
        $response->assertCreated()->assertJsonPath('data.status','pending')->assertJsonPath('data.quotation_amount',null)
            ->assertJsonPath('data.items.0.product.id',$payload['items'][0]['product_id']);
        return $response->json('data.id');
    }
    public function test_customer_login_submission_and_mysql_storage(): void
    {
        [$customer,$token]=$this->loginAs('customer');
        $id=$this->submit($token);
        $this->assertDatabaseHas('quotation_requests',['id'=>$id,'user_id'=>$customer->id,'status'=>'pending','quotation_amount'=>null]);
        $this->token($token)->getJson('/api/quotation-requests/'.$id)->assertOk()->assertJsonPath('data.status','pending');
    }
    public function test_other_customer_cannot_list_view_edit_delete_or_accept_another_request(): void
    {
        [, $ownerToken]=$this->loginAs('customer');$id=$this->submit($ownerToken);
        [, $otherToken]=$this->loginAs('customer');
        $ids=$this->token($otherToken)->getJson('/api/quotation-requests?per_page=100')->assertOk()->json('data');
        $this->assertNotContains($id,array_column($ids,'id'));
        $this->token($otherToken)->getJson('/api/quotation-requests/'.$id)->assertForbidden();
        $this->token($otherToken)->putJson('/api/quotation-requests/'.$id,$this->payload())->assertForbidden();
        $this->token($otherToken)->deleteJson('/api/quotation-requests/'.$id)->assertForbidden();
        $this->token($otherToken)->patchJson('/api/quotation-requests/'.$id.'/accept')->assertForbidden();
        $this->assertDatabaseHas('quotation_requests',['id'=>$id,'status'=>'pending']);
    }
    public function test_customer_cannot_quote_or_complete_and_admin_cannot_accept(): void
    {
        [, $customerToken]=$this->loginAs('customer');$id=$this->submit($customerToken);
        foreach(['quoted','completed'] as $status)$this->token($customerToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>$status])->assertForbidden();
        [, $adminToken]=$this->loginAs('admin');
        $this->token($adminToken)->getJson('/api/quotation-requests/'.$id)->assertOk();
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/accept')->assertStatus(422);
        $this->assertDatabaseHas('quotation_requests',['id'=>$id,'status'=>'pending']);
    }
    public function test_invalid_transitions_and_missing_amount_leave_request_pending(): void
    {
        [, $customerToken]=$this->loginAs('customer');$id=$this->submit($customerToken);
        $this->token($customerToken)->patchJson('/api/quotation-requests/'.$id.'/accept')->assertStatus(422);
        [, $adminToken]=$this->loginAs('admin');
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'quoted'])->assertStatus(422)->assertJsonValidationErrors('quotation_amount');
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'quoted','quotation_amount'=>-1])->assertStatus(422)->assertJsonValidationErrors('quotation_amount');
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'completed'])->assertStatus(422);
        $this->assertDatabaseHas('quotation_requests',['id'=>$id,'status'=>'pending','quotation_amount'=>null]);
    }
    public function test_full_workflow_and_actual_dashboard_deltas_with_approved_demo_amount(): void
    {
        $amount=getenv('QUOTATION_DEMO_AMOUNT');
        if($amount===false||$amount==='')$this->markTestSkipped('Needs an explicitly approved QUOTATION_DEMO_AMOUNT; no amount invented.');
        $this->assertTrue(is_numeric($amount)&&(float)$amount>=0,'Demo amount must be numeric and non-negative.');
        [, $customerToken]=$this->loginAs('customer');[, $adminToken]=$this->loginAs('admin');
        $baseline=$this->token($adminToken)->getJson('/api/dashboard')->assertOk()->json('data');
        $id=$this->submit($customerToken);
        $this->token($adminToken)->getJson('/api/dashboard')->assertOk()->assertJsonPath('data.pending_requests',$baseline['pending_requests']+1);
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'quoted','quotation_amount'=>$amount,'admin_notes'=>'APPROVED DEMONSTRATION AMOUNT - ROLLBACK TEST ONLY'])->assertOk()->assertJsonPath('data.status','quoted');
        $this->token($customerToken)->getJson('/api/quotation-requests/'.$id)->assertOk()->assertJsonPath('data.quotation_amount',number_format((float)$amount,2,'.',''));
        $this->token($adminToken)->getJson('/api/dashboard')->assertOk()->assertJsonPath('data.pending_requests',$baseline['pending_requests'])->assertJsonPath('data.quoted_requests',$baseline['quoted_requests']+1);
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'completed'])->assertStatus(422);
        $this->token($customerToken)->patchJson('/api/quotation-requests/'.$id.'/accept')->assertOk()->assertJsonPath('data.status','accepted');
        $this->token($customerToken)->patchJson('/api/quotation-requests/'.$id.'/accept')->assertStatus(422);
        $this->token($customerToken)->putJson('/api/quotation-requests/'.$id,$this->payload())->assertForbidden();
        $this->token($adminToken)->getJson('/api/dashboard')->assertOk()->assertJsonPath('data.quoted_requests',$baseline['quoted_requests'])->assertJsonPath('data.accepted_requests',$baseline['accepted_requests']+1);
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'completed'])->assertOk()->assertJsonPath('data.status','completed');
        $this->token($adminToken)->patchJson('/api/quotation-requests/'.$id.'/status',['status'=>'completed'])->assertStatus(422);
        $final=$this->token($adminToken)->getJson('/api/dashboard')->assertOk()->assertJsonPath('data.accepted_requests',$baseline['accepted_requests'])->assertJsonPath('data.completed_requests',$baseline['completed_requests']+1)->json('data');
        $this->assertEqualsWithDelta((float)$baseline['sales_total']+(float)$amount,(float)$final['sales_total'],0.001);
        $this->assertDatabaseHas('quotation_requests',['id'=>$id,'status'=>'completed','quotation_amount'=>$amount]);
        $this->token($customerToken)->getJson('/api/quotation-requests/'.$id)->assertOk()->assertJsonPath('data.status','completed');
    }
}
