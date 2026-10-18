# API documentation

The Laravel API is served under `/api`. Protected endpoints require `Authorization: Bearer {token}`.

Customers can register, browse and filter products, and create, view, update, or delete their own pending quotation requests. They can accept a request after the administrator sets its quotation amount and status to `quoted` using `PATCH /quotation-requests/{id}/accept`.

Administrators can manage products and categories, search and filter requests, and update request status with `PATCH /quotation-requests/{id}/status`. The workflow is `pending` → `quoted` → `accepted` → `completed`; pending requests may also be rejected. A `quotation_amount` is required when marking a request quoted. The dashboard includes counts by status and completed quotation sales totals.
