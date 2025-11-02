# Suggested API Documentation Format

## Base Configuration
```
Base URL: https://e29d425094dc.ngrok-free.app
API Version: v1
```

---

## 🔐 Authentication Flow

### Overview
1. User login → Get `access_token` & `refresh_token`
2. Call `/v1/auth/me` dengan access_token → Get user data
3. Simpan tokens & user data di localStorage
4. Gunakan access_token untuk protected endpoints
5. Refresh token saat expired
6. Logout → Clear tokens

---

## API Endpoints

### 1. Login
**POST** `/v1/auth/login`

**Request Body:**
```json
{
  "email": "afri@mail.com",
  "password": "123456"
}
```

**Success Response (200):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey",
    "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",  // ⚠️ Perlu konfirmasi: apa ini ada?
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "success": true
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "INVALID_CREDENTIALS",
    "message": "Invalid email or password",
    "details": {}
  },
  "success": false
}
```

**Notes:**
- ⚠️ **Perlu konfirmasi:** Apakah response login ada `refresh_token`?
- Setelah login, FE harus call `/v1/auth/me` untuk get user data

---

### 2. Get Current User
**GET** `/v1/auth/me`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Success Response (200):**
```json
{
  "data": {
    "id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "demo@example.com"
  },
  "success": true
}
```

**Error Response (401):**
```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token",
    "details": {}
  },
  "success": false
}
```

---

### 3. Refresh Token
**POST** `/v1/auth/refresh`

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey",
    "token_type": "Bearer",
    "expires_in": 3600
  },
  "success": true
}
```

---

### 4. Logout
**POST** `/v1/auth/logout`

**Headers:**
```
Authorization: Bearer {access_token}
```

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Success Response (200):**
```json
{
  "data": null,
  "success": true
}
```

---

## 🏗️ Domain Entities (Updated)

```ts
// domain/entities/User.ts
export interface User {
  id: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
  tokenType: string;
  expiresIn: number;
}
```

---

## 🔄 Infrastructure Mapper

```ts
// infrastructure/auth/AuthRepository.ts

// API Response Types
interface LoginApiResponse {
  data: {
    access_token: string;
    refresh_token?: string;
    token_type: string;
    expires_in: number;
  };
  success: boolean;
}

interface UserApiResponse {
  data: {
    id: string;
    email: string;
  };
  success: boolean;
}

interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details: any;
  };
  success: false;
}

// Mappers
const mapLoginResponse = (data: LoginApiResponse['data']): LoginResponse => ({
  accessToken: data.access_token,
  refreshToken: data.refresh_token,
  tokenType: data.token_type,
  expiresIn: data.expires_in,
});

const mapUserResponse = (data: UserApiResponse['data'], accessToken: string): User => ({
  id: data.id,
  email: data.email,
  accessToken,
  refreshToken: storage.getRefreshToken() || undefined,
});
```

---

## ❓ Questions for Backend Team

1. **Refresh Token:** Apakah login response ada `refresh_token`? Atau hanya `access_token`?
2. **User Data:** Apakah setelah login FE harus call `/v1/auth/me` atau sudah include di login response?
3. **Token Refresh:** Saat refresh, apakah `refresh_token` juga di-regenerate (rotating refresh token)?
4. **Logout Headers:** Apakah `/v1/auth/logout` butuh `Authorization: Bearer {token}` header?
5. **Error Codes:** Apa saja error code lain yang mungkin? (VALIDATION_ERROR, SERVER_ERROR, etc)
6. **CORS:** Apakah ngrok URL sudah handle CORS untuk development?

---

## 🎯 Implementation Flow

### Login Flow:
```
1. User submit form
2. POST /v1/auth/login
3. Save access_token & refresh_token to storage
4. GET /v1/auth/me with access_token
5. Save user data to storage
6. Redirect to /dashboard
```

### Logout Flow:
```
1. User click logout
2. POST /v1/auth/logout with refresh_token (+ auth header?)
3. Clear all storage
4. Redirect to /login
```
