<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('quotation_requests', function (Blueprint $table) {
            $table->id(); $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('project_title')->index(); $table->text('project_description'); $table->string('project_location');
            $table->date('preferred_date')->nullable(); $table->enum('status', ['pending','approved','in_progress','completed','rejected'])->default('pending')->index();
            $table->decimal('estimated_budget', 12, 2)->nullable(); $table->text('admin_notes')->nullable(); $table->timestamps();
        });
    }
    public function down(): void { Schema::dropIfExists('quotation_requests'); }
};
