# FlorGlassAluminum Management and Quotation System

**Author:** Jiliane Aguanza

Flor Glass & Aluminum Works is a Villanueva, Tubigon, Bohol business providing customized glass, aluminum, steel, security, canopy, and roofing work. This app replaces informal quotation follow-up with a customer-facing request tracker and an administrator management portal.

## Roles and features

- Customers register, browse and filter services, submit multi-item quotation requests, and follow their status.
- Administrators view database-driven dashboard and completed sales totals, manage categories/products, inspect customers and requests, search/filter requests, and move requests through Pending -> Quoted -> Accepted -> Completed (or reject Pending requests).
- Administrators set a quotation amount when quoting; customers review and accept the quotation in their account.
- Laravel validates and authorizes every protected operation; React hides protected screens and Axios sends Sanctum bearer tokens.

## Stack and database

Laravel 12, Sanctum, MySQL, React 19 with Vite, React Router, Axios, and Context API. Main tables: `users`, `categories`, `products`, `quotation_requests`, `quotation_request_items`, and Sanctum personal access tokens.

## Setup

1. Create a MySQL database named `florglass_aluminum`.
2. Copy `backend/.env.example` to `backend/.env`, then set the database credentials.
3. In `backend`, run `composer install`, `php artisan key:generate`, `php artisan migrate --seed`, then `php artisan serve`.
4. Copy `frontend/.env.example` to `frontend/.env` if the backend URL differs.
5. In `frontend`, run `npm install` then `npm run dev`.

Use `npm run build` to make a production frontend build.

## Demo accounts

- Administrator: `admin@florglassaluminum.test` / `FlorGlass2026!`
- Customer: `rogelio.villamor@example.test` / `Customer2026!`

## API endpoints

Protected endpoints require an `Authorization: Bearer {token}` header (Laravel Sanctum).

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Register a customer |
| POST | `/api/login` | Public | Sign in and receive a token |
| POST | `/api/logout` | Authenticated | Sign out |
| GET | `/api/user` | Authenticated | View the current user |
| GET | `/api/categories` | Public | List categories |
| POST | `/api/categories` | Admin | Create a category |
| GET | `/api/categories/{category}` | Admin | View a category |
| PUT/PATCH | `/api/categories/{category}` | Admin | Update a category |
| DELETE | `/api/categories/{category}` | Admin | Delete a category |
| GET | `/api/products` | Public | List products |
| GET | `/api/products/{product}` | Public | View a product |
| POST | `/api/products` | Admin | Create a product |
| PUT/PATCH | `/api/products/{product}` | Admin | Update a product |
| DELETE | `/api/products/{product}` | Admin | Delete a product |
| GET | `/api/quotation-requests` | Authenticated | List requests visible to the user |
| POST | `/api/quotation-requests` | Authenticated | Submit a request |
| GET | `/api/quotation-requests/{quotation_request}` | Owner or admin | View a request |
| PUT | `/api/quotation-requests/{quotation_request}` | Authorized user | Update a request subject to ownership and status rules |
| DELETE | `/api/quotation-requests/{quotation_request}` | Authorized user | Delete a request subject to ownership and status rules |
| PATCH | `/api/quotation-requests/{quotation_request}/accept` | Customer owner | Accept a quoted request |
| PATCH | `/api/quotation-requests/{quotation_request}/status` | Admin | Set quotation amount and update status |
| GET | `/api/dashboard` | Admin | View dashboard summaries |
| GET | `/api/customers` | Admin | List customers |

## Documentation and disclosure

Supporting files in `docs/` include the ERD image, screenshots, and presentation PDF. The API endpoint summary is included above. This project was built with AI assistance for scaffolding, code explanations, and documentation; review and understand every file before presenting it as individual work.

## Limitations and Phase 2

The current version stores an optional image URL rather than uploading files. Phase 2 can add image uploads, email notifications, printable quotations, appointment calendars, and audit history.
