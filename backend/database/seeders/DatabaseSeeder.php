<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\QuotationRequest;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Marivic Flores',
            'email' => 'admin@florglassaluminum.test',
            'password' => Hash::make('FlorGlass2026!'),
            'role' => 'admin',
        ]);

        $customers = collect([
            [
                'name' => 'Rogelio Villamor',
                'email' => 'rogelio.villamor@example.test',
            ],
            [
                'name' => 'Liezl Mae Abapo',
                'email' => 'liezl.abapo@example.test',
            ],
            [
                'name' => 'Cristina C. Bolo',
                'email' => 'cristina.bolo@example.test',
            ],
            [
                'name' => 'Joel P. Gaviola',
                'email' => 'joel.gaviola@example.test',
            ],
            [
                'name' => 'Marites E. Lagrimas',
                'email' => 'marites.lagrimas@example.test',
            ],
            [
                'name' => 'Arnel B. Tumulak',
                'email' => 'arnel.tumulak@example.test',
            ],
            [
                'name' => 'Jessa Marie T. Paredes',
                'email' => 'jessa.paredes@example.test',
            ],
            [
                'name' => 'Ramon S. Alipio',
                'email' => 'ramon.alipio@example.test',
            ],
            [
                'name' => 'Nerissa A. Caballes',
                'email' => 'nerissa.caballes@example.test',
            ],
            [
                'name' => 'Dante C. Baguio',
                'email' => 'dante.baguio@example.test',
            ],
        ])->map(function ($person) {
            return User::create([
                ...$person,
                'password' => Hash::make('Customer2026!'),
                'role' => 'customer',
            ]);
        });

        $categories = [];

        $categoryData = [
            'Windows' => 'Custom aluminum windows for homes and commercial spaces.',
            'Doors' => 'Glass and aluminum entry, sliding, and swing doors.',
            'Glass Works' => 'Glass enclosures, frames, partitions, and display solutions.',
            'Security Works' => 'Security grills and protective steel fabrication.',
            'Roofing & Canopies' => 'Weather protection, canopies, trusses, and roofing.',
            'Aluminum Layouts' => 'Ceilings, wall cladding, and aluminum layout work.',
        ];

        foreach ($categoryData as $name => $description) {
            $categories[$name] = Category::create([
                'name' => $name,
                'description' => $description,
            ]);
        }

        $productData = [
            ['Windows', 'Sliding Window', 'Two-panel powder-coated aluminum sliding window with clear glass', 'Window', 8500],
            ['Windows', 'Awning Window', 'Top-hinged awning window with insect screen option', 'Window', 6200],
            ['Windows', 'Casement Window', 'Outward-opening aluminum casement window', 'Window', 7100],
            ['Doors', 'Sliding Glass Door', 'Tempered glass sliding door with heavy-duty aluminum frame', 'Door', 18500],
            ['Doors', 'Aluminum Swing Door', 'Aluminum framed swing door for residential entry', 'Door', 12500],
            ['Doors', 'Storefront Glass Door', 'Commercial tempered glass door with floor hinge', 'Door', 24500],
            ['Glass Works', 'Shower Enclosure', 'Frameless tempered glass shower enclosure', 'Glass Enclosure', 28500],
            ['Glass Works', 'Glass Showcase', 'Lockable glass display showcase with aluminum framing', 'Showcase', 16800],
            ['Glass Works', 'Glass Partition', 'Office glass partition with aluminum mullions', 'Partition', 14200],
            ['Glass Works', 'Decorative Glass Frame', 'Custom-cut glass frame for wall display', 'Glass Frame', 3200],
            ['Security Works', 'Window Security Grill', 'Welded steel window security grill with enamel finish', 'Security Grill', 5400],
            ['Security Works', 'Stainless Steel Railing', 'Stainless railing for stairs or balcony', 'Stainless Work', 19500],
            ['Roofing & Canopies', 'Polycarbonate Canopy', 'Clear polycarbonate canopy with steel supports', 'Canopy', 22500],
            ['Roofing & Canopies', 'Steel Roof Truss', 'Fabricated steel truss for residential roofing', 'Truss', 38500],
            ['Roofing & Canopies', 'Pre-painted Roofing', 'Pre-painted long-span roofing supply and installation', 'Roofing', 28500],
            ['Aluminum Layouts', 'PVC Ceiling Layout', 'PVC ceiling panels with aluminum carrier system', 'Ceiling', 18500],
            ['Aluminum Layouts', 'Aluminum Composite Panel Cladding', 'Exterior ACP cladding with aluminum framing', 'Aluminum Layout', 32000],
            ['Glass Works', 'Tempered Glass Table Top', 'Custom 10 mm tempered glass table top', 'Glass Work', 6500],
            ['Windows', 'Fixed Picture Window', 'Large fixed glass window with slim aluminum frame', 'Window', 11200],
            ['Doors', 'Screen Door', 'Sliding insect screen door on aluminum track', 'Door', 4800],
        ];

        $products = collect($productData)->map(function ($item) use ($categories) {
            return Product::create([
                'category_id' => $categories[$item[0]]->id,
                'name' => $item[1],
                'description' => $item[2],
                'type' => $item[3],
                'estimated_price' => $item[4],
                'is_active' => true,
            ]);
        });

        $titles = [
            'Tubigon residence window replacement',
            'Kitchen sliding door installation',
            'Bohol beach house shower enclosure',
            'Commercial display showcase',
            'Barangay hall security grill',
            'Carport canopy fabrication',
            'Office glass partition',
            'Second-floor balcony railing',
            'New home roofing and truss',
            'Aluminum ceiling layout',
        ];

        $statuses = [
            'pending',
            'quoted',
            'accepted',
            'completed',
            'rejected',
            'pending',
            'quoted',
            'completed',
            'accepted',
            'pending',
        ];

        foreach ($titles as $index => $title) {
            $status = $statuses[$index];

            $quote = QuotationRequest::create([
                'user_id' => $customers[$index]->id,
                'project_title' => $title,
                'project_description' => 'Customized fabrication and installation request. Customer requests a site measurement and an itemized quotation before work begins.',
                'project_location' => [
                    'Villanueva, Tubigon, Bohol',
                    'Centro, Tubigon, Bohol',
                    'Macaas, Tubigon, Bohol',
                    'Pinayagan Norte, Tubigon, Bohol',
                ][$index % 4],
                'preferred_date' => now()->addDays(10 + $index),
                'status' => $status,
                'estimated_budget' => 18000 + ($index * 7500),
                'quotation_amount' => in_array($status, [
                    'quoted',
                    'accepted',
                    'completed',
                ])
                    ? 22000 + ($index * 7500)
                    : null,
                'admin_notes' => in_array($status, [
                    'quoted',
                    'accepted',
                    'completed',
                ])
                    ? 'Site assessment scheduled with the fabrication team.'
                    : null,
            ]);

            $quote->items()->createMany([
                [
                    'product_id' => $products[$index % $products->count()]->id,
                    'quantity' => 1 + ($index % 3),
                    'specifications' => 'Measurements to be confirmed during site visit.',
                ],
                [
                    'product_id' => $products[($index + 3) % $products->count()]->id,
                    'quantity' => 1,
                    'specifications' => 'Color and glass thickness subject to final quotation.',
                ],
            ]);
        }
    }
}