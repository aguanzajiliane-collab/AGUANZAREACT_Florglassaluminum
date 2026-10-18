<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quotation_request_items', function (Blueprint $table) {
            $table->id(); $table->foreignId('quotation_request_id')->constrained()->cascadeOnDelete();
            $table->foreignId('product_id')->constrained()->restrictOnDelete(); $table->unsignedInteger('quantity');
            $table->text('specifications')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quotation_request_items'); }
};
