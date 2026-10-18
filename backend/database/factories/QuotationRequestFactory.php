<?php
namespace Database\Factories;
use App\Models\User; use Illuminate\Database\Eloquent\Factories\Factory;
class QuotationRequestFactory extends Factory { public function definition(): array { return ['user_id'=>User::factory(),'project_title'=>'Residential aluminum improvement','project_description'=>fake()->paragraph(),'project_location'=>'Tubigon, Bohol','preferred_date'=>fake()->dateTimeBetween('+1 week','+3 months'),'status'=>'pending','estimated_budget'=>fake()->numberBetween(15000,120000)]; } }
