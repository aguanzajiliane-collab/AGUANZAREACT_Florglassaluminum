<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->decimal('quotation_amount', 12, 2)->nullable()->after('estimated_budget');
        });

        // Expand first so MySQL accepts the replacement values during migration.
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'in_progress', 'quoted', 'accepted', 'completed', 'rejected'])->default('pending')->change();
        });
        // Existing records remain meaningful under the proposal's terminology.
        DB::table('quotation_requests')->where('status', 'approved')->update(['status' => 'accepted']);
        DB::table('quotation_requests')->where('status', 'in_progress')->update(['status' => 'accepted']);
        DB::table('quotation_requests')->where('status', 'accepted')->whereNull('quotation_amount')->update(['quotation_amount' => DB::raw('estimated_budget')]);
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'quoted', 'accepted', 'completed', 'rejected'])->default('pending')->change();
        });
    }

    public function down(): void
    {
        DB::table('quotation_requests')->where('status', 'quoted')->update(['status' => 'approved']);
        DB::table('quotation_requests')->where('status', 'accepted')->update(['status' => 'approved']);
        Schema::table('quotation_requests', function (Blueprint $table) {
            $table->enum('status', ['pending', 'approved', 'in_progress', 'completed', 'rejected'])->default('pending')->change();
            $table->dropColumn('quotation_amount');
        });
    }
};
