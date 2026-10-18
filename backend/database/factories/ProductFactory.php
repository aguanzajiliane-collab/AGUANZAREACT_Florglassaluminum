<?php
namespace Database\Factories;
use App\Models\Category; use Illuminate\Database\Eloquent\Factories\Factory;
class ProductFactory extends Factory { public function definition(): array { return ['category_id'=>Category::factory(),'name'=>fake()->words(3,true),'description'=>fake()->paragraph(),'type'=>'Fabrication','estimated_price'=>fake()->numberBetween(2500,25000),'is_active'=>true]; } }
