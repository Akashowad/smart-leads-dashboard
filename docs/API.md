# Smart Leads Dashboard API

Base URL: `http://localhost:5000/api`

All protected routes require:

```http
Authorization: Bearer <jwt>
```

## Response Shape

```json
{
  "success": true,
  "data": {}
}
```

Validation and server errors use:

```json
{
  "success": false,
  "message": "Readable error message"
}
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Admin User",
  "email": "admin@example.com",
  "password": "password123",
  "role": "Admin"
}
```

Roles: `Admin`, `Sales User`

### Login

`POST /auth/login`

```json
{
  "email": "admin@example.com",
  "password": "password123"
}
```

### Current User

`GET /auth/me`

## Leads

Lead statuses: `New`, `Contacted`, `Qualified`, `Lost`

Lead sources: `Website`, `Instagram`, `Referral`

### List Leads

`GET /leads`

Query parameters:

| Name | Values | Notes |
| --- | --- | --- |
| `status` | Lead status | Optional |
| `source` | Lead source | Optional |
| `search` | text | Matches name or email |
| `sort` | `latest`, `oldest` | Defaults to `latest` |
| `page` | positive number | 10 records per page |

Example:

```http
GET /api/leads?status=Qualified&source=Instagram&search=Rahul&sort=latest&page=1
```

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Sharma",
  "email": "rahul@example.com",
  "status": "Qualified",
  "source": "Instagram"
}
```

### Get Lead

`GET /leads/:id`

### Update Lead

`PATCH /leads/:id`

```json
{
  "status": "Contacted"
}
```

### Delete Lead

`DELETE /leads/:id`

Admin only.

### Export CSV

`GET /leads/export`

Accepts the same filters as list leads and returns a CSV file.

## RBAC

Admins can list, create, update, delete, and export all leads.

Sales users can list, create, update, view, and export their own leads. They cannot delete leads.
