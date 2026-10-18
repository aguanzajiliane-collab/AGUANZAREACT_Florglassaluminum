# Installed product catalog

17 MySQL products, six categories, 17 unique supplied images. All estimated prices are NULL and display as **Request a Quote**. No accounts or quotation records are created or changed by this import.

Images are stored in `backend/public/products/`. The `products.image` column holds the paths below. React resolves these paths against the Laravel API origin, not the React development server.

| ID | Product | Category | Image path (under `/products/`) |
|---|---|---|---|
| 1 | Aluminum Security Screen Door | Doors | Glass%20Door%20Panels.jpg |
| 2 | Black Tinted Glass | Glass Panels | tintedglass.png |
| 3 | Steel Angle Bars | Metal Works | steel-bar.png |
| 4 | Blue Glass Sliding Window | Windows | blue-glass.png |
| 5 | Green Tinted Glass Window | Windows | green-glass.png |
| 6 | Bronze Aluminum Sliding Window | Windows | bronze-glass.png |
| 7 | Clear Glass Sliding Window | Windows | clear-glass.png |
| 8 | Stainless Steel Decorative Railing | Metal Works | terrace.png |
| 9 | Glass Panels / Glass Sheets | Glass Panels | home.png |
| 10 | Decorative Framed Wall Mirror | Mirrors | mirrorframe.png |
| 11 | Aluminum Jalousie Window | Windows | jalousie.png |
| 12 | Bronze Tinted Glass Panels | Glass Panels | brownglass.png |
| 13 | Sliding Window Roller Hardware | Accessories | glasswindowroller.png |
| 14 | Gray Tinted Glass Window | Windows | gray-glass.png |
| 15 | Frosted Glass Partition | Glass Panels | frosted-glass.png |
| 16 | Tempered Glass Panels | Glass Panels | tempered-glass.png |
| 17 | Window Handles and Locks | Accessories | Window%20Handles%20and%20Locks.jpg |

`home.png` is cataloged as generic glass sheets, without asserting a specific thickness or grade. The glass-panel photos do not establish tempering certification; confirm specifications when quoting. Descriptive filenames replace the earlier references to `image(1).png` through `image(6).png`.

To safely rerun from `backend`: `php artisan db:seed --class=ProductCatalogSeeder --force`. This seeder uses category name and product/category name matches, preserving existing entries on rerun. Do not run DatabaseSeeder or database reset commands for this catalog.

Frontend configuration: `VITE_API_URL=http://127.0.0.1:8000/api`, `VITE_MOCK_API=false`. Use existing MySQL account credentials when signing in; mock login sessions cannot authenticate against Laravel. Keep XAMPP MySQL and the Laravel API running. The source images and database records persist when servers restart.
