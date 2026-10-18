# Entity Relationship Diagram

`users` 1-to-many `quotation_requests` 1-to-many `quotation_request_items`. A request stores project details, status, estimated budget, and the administrator's `quotation_amount`; accepting a quotation advances that project record into the accepted/completed work pipeline.

`categories` 1-to-many `products`; each quotation item belongs to one product.

Accepted quotation requests are the order/project records in this version, so there is no separate `orders` table.

Use this as the source for a visual ERD in the capstone presentation.
