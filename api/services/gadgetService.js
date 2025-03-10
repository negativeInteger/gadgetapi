# Gadget API Documentation

## Overview
The **Gadget API** allows users to manage gadgets efficiently. It supports full CRUD operations, robust authentication, and token revocation. Built using **Node.js, Express, PostgreSQL, and Prisma**, it ensures scalability and security.

## Features
- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Token Revocation**: Ability to revoke access tokens.
- **CRUD Operations**: Create, read, update, and delete gadgets.
- **Self Destruct**: Self-Destruct via confirmation code.
- **Swagger Documentation**: API endpoints are documented with Swagger.
- **Testing**: Uses Jest for testing and Prisma for database interactions.

## Getting Started

### Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (version v22.11.0 or higher)
- [PostgreSQL](https://www.postgresql.org/) (version 17.4 or higher)
- [Prisma](https://www.prisma.io/)

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
  "password": "securepassword"
  "role": "admin"
}
```
**Response:**
```json
{
  "message": "Registration successfull!, Hey john_doe you can login now",
}
```

### Login
**Endpoint:** `POST /api/auth/login`

**Description:** Authenticates a user and set tokens.

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
  "status": "AVAILABLE"
}
```
**Response:**
```json
  {
    "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
    "name": "Smartwatch",
    "codename: "IMF-zaddcYU34d"
    "status": "AVAILABLE",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": null
  }
```
### Get All Gadgets
**Endpoint:** `GET /api/gadgets`

**Authentication:** Bearer Token

**Response:**
```json
[
  {
    "id": '1cdbbea8-e913-4c49-9f59-745382e2d4b2',
    "name": "Smartwatch",
    "codename: "IMF-zaddcYU34d",
    "status": "AVAILABLE",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": null
  },
  {
    "id": '1cdbbea8-e913-4c49-9f59-745382e2d4b2',
    "name": "Laptop",
    "codename: "IMF-cappcYU57w",
    "status": "DECOMMISSIONED",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": "2025-03-10 12:40:07.373"
  }
]
```

### Update a Gadget
**Endpoint:** `PATCH /api/gadgets/:id`

**Authentication:** Bearer Token

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
    "codename: "IMF-zaddcYU34d"
    "status": "DEPLOYED",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": null
  }
```
### Delete a Gadget
**Endpoint:** `DELETE /api/gadgets/:id`

**Authentication:** Bearer Token

**Description:** Setting status to DECOMISSIONED, and adding a timestamp

**Response:**
```json
  {
    "id": "1cdbbea8-e913-4c49-9f59-745382e2d4b2",
    "name": "Smartwatch",
    "codename: "IMF-zaddcYU34d"
    "status": "DECOMMISSIONED",
    "createdAt": "2025-03-10 12:39:51.525",
    "updatedAt": "2025-03-10 12:40:07.373",
    "decommissionedAt": 2025-03-10 12:40:07.373
  }
```
### Self-Destruct a Gadget
**Endpoint:** `DELETE /api/gadgets/:id/self-destruct`

**Authentication:** Bearer Token

**Description:** Initiating self-destruct by sending a confirmation code

**Response:**
```json
  {
    "message": "Confirmation code generated. Use this code to confirm self-destruct.",
    "expiresIn": "3 minutes",
    "code": "123567"
  }
```
### Confirm Self-Destruct Gadget
**Endpoint:** `DELETE /api/gadgets/:id/self-destruct/confirm`

**Authentication:** Bearer Token

**Description:** Permanently deletes gadget if the code matches

**Request Body:** 
```json
  {
    "code": "123567"
  }
```
## Token Revocation
### Logout
**Endpoint:** `POST /api/auth/logout`

**Description:** Revokes the user's token and logs out the user and remove tokens

## Testing
Run the test suite using:
```sh
npm test
```

## Swagger Documentation
Access the Swagger UI at:
```
http://localhost:3000/docs
```

## License
This project is licensed under the MIT License.

