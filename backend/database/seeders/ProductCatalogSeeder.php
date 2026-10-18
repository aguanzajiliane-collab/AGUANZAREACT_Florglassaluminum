<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

// Run only this seeder: php artisan db:seed --class=ProductCatalogSeeder
// Never calls DatabaseSeeder or changes accounts, quotations, or unrelated products.
class ProductCatalogSeeder extends Seeder
{
    public function run(): void
    {
        $catalog = [
            ['Doors', 'Aluminum Security Screen Door', 'Screen Door', 'Black aluminum security screen door with protective mesh.', 'Glass Door Panels.jpg'],
            ['Glass Panels', 'Black Tinted Glass', 'Tinted Glass', 'Black tinted glass panel for custom glass applications.', 'tintedglass.png'],
            ['Metal Works', 'Steel Angle Bars', 'Angle Bar', 'Steel angle bars for fabrication and structural support applications.', 'steel-bar.png'],
            ['Windows', 'Blue Glass Sliding Window', 'Sliding Window', 'Aluminum sliding window with blue-tinted glass.', 'blue-glass.png'],
            ['Windows', 'Green Tinted Glass Window', 'Glass Window', 'Aluminum-framed window with green-tinted glass.', 'green-glass.png'],
            ['Windows', 'Bronze Aluminum Sliding Window', 'Sliding Window', 'Bronze-finish aluminum sliding window.', 'bronze-glass.png'],
            ['Windows', 'Clear Glass Sliding Window', 'Sliding Window', 'Aluminum sliding window with clear glass.', 'clear-glass.png'],
            ['Metal Works', 'Stainless Steel Decorative Railing', 'Decorative Railing', 'Stainless steel railing with decorative details for stairs or terraces.', 'terrace.png'],
            ['Glass Panels', 'Glass Panels / Glass Sheets', 'Glass Sheet', 'Glass sheets for custom fabrication. Confirm thickness and specifications when requesting a quotation.', 'home.png'],
            ['Mirrors', 'Decorative Framed Wall Mirror', 'Framed Mirror', 'Wall mirror with a decorative gold-tone frame.', 'mirrorframe.png'],
            ['Windows', 'Aluminum Jalousie Window', 'Jalousie Window', 'Aluminum-framed jalousie window with adjustable glass louvers.', 'jalousie.png'],
            ['Glass Panels', 'Bronze Tinted Glass Panels', 'Tinted Glass', 'Bronze-tinted glass panels for custom glass applications.', 'brownglass.png'],
            ['Accessories', 'Sliding Window Roller Hardware', 'Roller Hardware', 'Roller hardware for compatible sliding window or door assemblies.', 'glasswindowroller.png'],
            ['Windows', 'Gray Tinted Glass Window', 'Glass Window', 'Aluminum-framed window with gray-tinted glass.', 'gray-glass.png'],
            ['Glass Panels', 'Frosted Glass Partition', 'Glass Partition', 'Frosted glass partition panels for interior privacy applications.', 'frosted-glass.png'],
            ['Glass Panels', 'Tempered Glass Panels', 'Tempered Glass', 'Glass panels supplied to the required project specifications. Confirm thickness and tempering certification when requesting a quotation.', 'tempered-glass.png'],
            ['Accessories', 'Window Handles and Locks', 'Window Hardware', 'Window handle and locking hardware for compatible aluminum window assemblies.', 'Window Handles and Locks.jpg'],
        ];

        // Validate every asset before writing any database records.
        foreach ($catalog as [, , , , $file]) {
            if (!is_file(public_path('products/'.$file)) || !getimagesize(public_path('products/'.$file))) {
                throw new \RuntimeException('Missing or invalid catalog image: '.$file);
            }
        }

        DB::transaction(function () use ($catalog) {
            foreach ($catalog as [$categoryName, $name, $type, $description, $file]) {
                $category = Category::firstOrCreate(['name' => $categoryName], [
                    'description' => 'Custom '.$categoryName.' from Flor Glass & Aluminum Works.',
                ]);
                // Existing records are kept intact when the import is rerun.
                Product::firstOrCreate(['category_id' => $category->id, 'name' => $name], [
                    'type' => $type,
                    'description' => $description,
                    'estimated_price' => null,
                    'image' => '/products/'.rawurlencode($file),
                    'is_active' => true,
                ]);
            }
        });
    }
}
