# Flor Glass & Aluminum Works — API Documentation

## 1. API Overview

The Flor Glass & Aluminum Works system uses a Laravel REST API to connect the React frontend to the MySQL database.

**Base URL (local development):** `http://127.0.0.1:8000/api`

All protected endpoints use Laravel Sanctum token authentication.

**Required header for protected requests:**

Authorization: Bearer {token}
Accept: application/json


The API supports customer registration, login, product browsing, quotation management, administrator operations, and dashboard reporting.

## 2. Authentication Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/register` | Public | Register a new account |
| POST | `/api/login` | Public | Authenticate a user |
| POST | `/api/logout` | Authenticated | Log out the current user |
| GET | `/api/user` | Authenticated | Retrieve the authenticated user's information |

## 3. Category Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/categories` | Public | Retrieve product categories |
| POST | `/api/categories` | Admin | Create a category |
| GET | `/api/categories/{category}` | Admin | Retrieve a specific category |
| PUT/PATCH | `/api/categories/{category}` | Admin | Update a category |
| DELETE | `/api/categories/{category}` | Admin | Delete a category |

## 4. Product Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/products` | Public | Retrieve the product list |
| GET | `/api/products/{product}` | Public | Retrieve a specific product |
| POST | `/api/products` | Admin | Create a product |
| PUT/PATCH | `/api/products/{product}` | Admin | Update a product |
| DELETE | `/api/products/{product}` | Admin | Delete a product |

## 5. Quotation Request Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/quotation-requests` | Authenticated | Retrieve quotation requests |
| POST | `/api/quotation-requests` | Authenticated | Create a quotation request |
| GET | `/api/quotation-requests/{quotation_request}` | Authenticated | Retrieve a quotation request |
| PUT | `/api/quotation-requests/{quotation_request}` | Authenticated | Update a quotation request |
| DELETE | `/api/quotation-requests/{quotation_request}` | Authenticated | Delete a quotation request |
| PATCH | `/api/quotation-requests/{quotation_request}/accept` | Authenticated | Accept a quotation |
| PATCH | `/api/quotation-requests/{quotation_request}/status` | Admin | Update quotation status |

**Note:** The quotation request routes are protected by `auth:sanctum`. Ownership checks, permitted operations, and status transition rules are handled by the controller and must be verified against its implementation.

## 6. Administrator Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | `/api/dashboard` | Admin | Retrieve dashboard information |
| GET | `/api/customers` | Admin | Retrieve paginated customer records |

The administrator also manages categories, products, and quotation statuses through the endpoints listed above.

The `/api/customers` route retrieves users with the `customer` role and paginates the results by 10 records per page.

## 7. Quotation Status Workflow

The quotation request follows this main workflow:

**Pending → Quoted → Accepted → Completed**

| Status | Description |
|---|---|
| Pending | A quotation request has been submitted |
| Quoted | The administrator has provided a quotation |
| Accepted | The customer has accepted the quotation |
| Completed | The administrator has marked the project as completed |
| Rejected | The quotation request has been rejected |

The database stores the quotation status in the `status` column of the `quotation_requests` table. The `quotation_amount` column stores the quoted amount.

The permitted status changes and their validation rules are implemented in the Laravel controller.

## 8. Database Relationships

The API works with five main business tables:

- `users`
- `categories`
- `products`
- `quotation_requests`
- `quotation_request_items`

The relationships are:

- One user can have multiple quotation requests.
- One category can contain multiple products.
- One quotation request can contain multiple quotation request items.
- One product can appear in multiple quotation request items.

The database structure is illustrated in `docs/FlorGlass_ERD_Drawing.png`.

## 9. HTTP Response Codes

The following are standard HTTP response codes relevant to the API. The exact responses for each endpoint depend on its controller implementation.

| Status Code | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource successfully created |
| 204 | Successful request with no response body |
| 401 | Authentication required or invalid token |
| 403 | Access forbidden |
| 404 | Requested resource not found |
| 422 | Request validation failed |
| 500 | Internal server error |

## 10. API Testing

The API can be tested using Postman or Thunder Client.

To test protected routes:

1. Start the Laravel development server.
2. Send a login request to `/api/login`.
3. Obtain the authentication token from the successful login response.
4. Add the token to the `Authorization: Bearer {token}` header.
5. Send requests to the protected endpoints.
6. Test administrator-only routes using an administrator account.

**Security:** Do not commit actual authentication tokens, passwords, or production credentials to the GitHub repository.

---

**Project:** Flor Glass & Aluminum Works  
**Backend:** Laravel REST API  
**Frontend:** React + Vite  
**Authentication:** Laravel Sanctum  
**Database:** MySQL / MariaDB
