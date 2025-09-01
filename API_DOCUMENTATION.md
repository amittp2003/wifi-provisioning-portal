# API Documentation

## User Registration

### Endpoint
```
POST /api/auth/register
```

### Description
Register a new user account

### Request Body
```json
{
  "email": "string",      // Required: User's email address
 "password": "string",   // Required: User's password
  "name": "string",       // Required: User's full name
  "role": "string"        // Optional: User's role (default: "user")
}
```

### Response
```json
{
  "success": true,
  "message": "User registered successfully"
}
```

### Example using Postman
1. Set method to POST
2. URL: http://localhost:5000/api/auth/register
3. Headers: Content-Type: application/json
4. Body (raw JSON):
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "name": "New User",
  "role": "user"
}
```

## User Login

### Endpoint
```
POST /api/auth/login
```

### Description
Authenticate a user and receive a JWT token

### Request Body
```json
{
  "email": "string",      // Required: User's email address
  "password": "string",   // Required: User's password
  "loginType": "string"   // Optional: Login type (default: "basic")
}
```

### Response
```json
{
  "success": true,
  "user": {
    "email": "string",
    "name": "string",
    "role": "string"
  },
  "token": "string",      // JWT token for authentication
  "message": "Login successful"
}
```

### Example using Postman
1. Set method to POST
2. URL: http://localhost:5000/api/auth/login
3. Headers: Content-Type: application/json
4. Body (raw JSON):
```json
{
  "email": "newuser@example.com",
  "password": "password123",
  "loginType": "basic"
}
```

## Get Current User

### Endpoint
```
GET /api/auth/me
```

### Description
Get the currently authenticated user's information

### Headers
```
Authorization: Bearer <JWT_TOKEN>
```

### Response
```json
{
  "success": true,
  "user": {
    "email": "string",
    "name": "string",
    "role": "string"
  }
}
```

### Example using Postman
1. Set method to GET
2. URL: http://localhost:5000/api/auth/me
3. Headers: 
   - Content-Type: application/json
   - Authorization: Bearer <YOUR_JWT_TOKEN>