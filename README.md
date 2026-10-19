# FlorGlassAluminum Management and Quotation System

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

Public: `POST /api/register`, `POST /api/login`, `GET /api/categories`, `GET /api/products`, `GET /api/products/{id}`.

Authenticated: `POST /api/logout`, `GET /api/user`, `GET|POST /api/quotation-requests`, `GET|PUT|DELETE /api/quotation-requests/{id}`.

Administrator: `GET /api/dashboard`, category and product CRUD, `GET /api/customers`, and `PATCH /api/quotation-requests/{id}/status`. Customers accept a quote with `PATCH /api/quotation-requests/{id}/accept`.

## Documentation and disclosure

Supporting files in `docs/` include the ERD image, screenshots, and presentation PDF. The API endpoint summary is included above. This project was built with AI assistance for scaffolding, code explanations, and documentation; review and understand every file before presenting it as individual work.

## Limitations and Phase 2

The current version stores an optional image URL rather than uploading files. Phase 2 can add image uploads, email notifications, printable quotations, appointment calendars, and audit history.
