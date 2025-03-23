# Gadget API Documentation

## Overview
**Gadget API** is a secure and scalable backend system for managing gadgets with role-based access control for users and admins.It features full CRUD operations, JWT authentication using access and refresh tokens via cookies, and unique self-destruct API with TTL-based confirmation logic. Built with **Node.js**, **Express**, **Prisma ORM**, **PostgreSQL**, and **Zod** for input validation. Focuses on clean code, secure practices, and is deployed on Render.

## Features
- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Token Revocation**: Ability to revoke access tokens.
- **Token Rotation**: Rotate refresh tokens when access token expires.
- **CRUD Operations**: Create, read, update, and delete gadgets.
- **Self Destruct**: Self-Destruct via confirmation code.
- **Swagger Documentation**: API endpoints are documented with Swagger.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version 22.11.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 17.4 or higher)
- [Prisma](https://www.prisma.io/)
- [Zod](https://zod.dev/)

### Installation
```sh
# Clone the repository
git clone https://github.com/negativeInteger/gadgetapi.git
cd gadgetapi

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npx prisma migrate dev

# Start the server
npm start
```

## Authentication

### Register
**Endpoint:** `POST /api/auth/register`

**Description:** Creates a new user account.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword",
  "role": "ADMIN"
}
```
**Response:**
```json
{
  "message": "Registration successful! Hey john_doe, you can login now."
}
```

### Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and sets tokens.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "securepassword"
}
```

## Gadgets API

### Create a Gadget
**Endpoint:** `POST /api/gadgets`

**Authentication:** Bearer Token

**Request Body:**
```json
{
  "name": "Smartwatch",
  "description": "BrandX",
}
```
**Response:**
```json
{
  "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
  "name": "Smartwatch",
  "codename": "IMF-zaddcYU34d",
  "status": "AVAILABLE",
  "createdAt": "2025-03-10 12:39:51.525",
  "updatedAt": "2025-03-10 12:40:07.373",
  "decommissionedAt": null
}
```

### Get All Gadgets
**Endpoint:** `GET /api/gadgets`

**Authentication:** HTTP-only cookies (`accessToken` and `refreshToken`)

**Response:**
```json
[
  {
    "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
    "name": "Smartwatch",
    "codename": "IMF-zaddcYU34d",
    "status": "AVAILABLE",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": null
  },
  {
    "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
    "name": "Laptop",
    "codename": "IMF-cappcYU57w",
    "status": "DECOMMISSIONED",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": "2025-03-10 12:40:07.373"
  }
]
```

### Update a Gadget
**Endpoint:** `PATCH /api/gadgets/:id`

**Authentication:** HTTP-only cookies (`accessToken` and `refreshToken`)

**Request Body:**
```json
{
  "name": "Smartwatch-updated",
  "description": "BrandY",
  "status": "DEPLOYED"
}
```
**Response:**
```json
{
  "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
  "name": "Smartwatch",
  "codename": "IMF-zaddcYU34d",
  "status": "DEPLOYED",
  "createdAt": "2025-03-10 12:39:51.525",
  "updatedAt": "2025-03-10 12:40:07.373",
  "decommissionedAt": null
}
```

### Delete a Gadget
**Endpoint:** `DELETE /api/gadgets/:id`

**Authentication:** HTTP-only cookies (`accessToken` and `refreshToken`)

**Description:** Setting the status to `DECOMMISSIONED`, and adding a timestamp.

**Response:**
```json
{
  "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
  "name": "Smartwatch",
  "codename": "IMF-zaddcYU34d",
  "status": "DECOMMISSIONED",
  "createdAt": "2025-03-10 12:39:51.525",
  "updatedAt": "2025-03-10 12:40:07.373",
  "decommissionedAt": "2025-03-10 12:40:07.373"
}
```

### Self-Destruct a Gadget
**Endpoint:** `POST /api/gadgets/:id/self-destruct`

**Authentication:** HTTP-only cookies (`accessToken` and `refreshToken`)

**Description:** Initiates the self-destruct by generating a confirmation code.

**Response:**
```json
{
  "message": "Confirmation code generated. Use this code to confirm self-destruct.",
  "expiresIn": "3 minutes",
  "code": "123567"
}
```

### Confirm Self-Destruct Gadget
**Endpoint:** `POST /api/gadgets/:id/self-destruct/confirm`

**Authentication:** HTTP-only cookies (`accessToken` and `refreshToken`)

**Description:** Permanently deletes the gadget if the code matches.

**Request Body:** 
```json
{
  "code": "123567"
}
```

## Token Revocation

### Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Revokes the user's token and logs out the user by removing the tokens.

## Swagger Documentation
Access the Swagger UI at:
```
http://localhost:3000/docs
```

## License
This project is licensed under the MIT License.
