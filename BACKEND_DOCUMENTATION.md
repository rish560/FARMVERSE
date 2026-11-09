# Agro Backend Documentation

## Overview
Intelligent Farm Operations Platform with Smart Agro Precision System built with Spring Boot. The backend provides a REST API for managing Users, Farms, and Crops with JWT-based authentication.

---

## Tech Stack
- Java 17
- Spring Boot
- Spring Security (JWT)
- Spring Data JPA (Hibernate)
- MySQL (hosted on Clever Cloud)
- HikariCP (connection pooling)
- Lombok
- Maven

---

## Project Structure
```
BackEnd/src/main/java/com/farmverse/
├── config/
│   └── SecurityConfig.java         # Spring Security configuration
├── controller/
│   ├── AuthController.java         # Register & Login endpoints
│   ├── UserController.java         # User CRUD endpoints
│   ├── FarmController.java         # Farm CRUD endpoints
│   └── CropController.java         # Crop CRUD endpoints
├── dto/
│   ├── RegisterRequestDTO.java     # Register input
│   ├── RegisterResponseDTO.java    # Register output
│   ├── LoginRequestDTO.java        # Login input
│   ├── LoginResponseDTO.java       # Login output (contains JWT token)
│   ├── UserRequestDTO.java         # User create/update input
│   ├── UserResponseDTO.java        # User output
│   ├── FarmRequestDTO.java         # Farm create/update input
│   ├── FarmResponseDTO.java        # Farm output
│   ├── CropRequestDTO.java         # Crop create/update input
│   └── CropResponseDTO.java        # Crop output
├── entity/
│   ├── User.java                   # Users table
│   ├── Farm.java                   # Farms table (ManyToOne -> User)
│   └── Crop.java                   # Crops table (ManyToOne -> Farm)
├── repository/
│   ├── UserRepository.java
│   ├── FarmRepository.java
│   └── CropRepository.java
├── service/
│   ├── AuthService.java / AuthServiceImpl.java
│   ├── UserService.java / UserServiceImpl.java
│   ├── FarmService.java / FarmServiceImpl.java
│   └── CropService.java / CropServiceImpl.java
├── security/
│   ├── JwtAuthenticationFilter.java        # Intercepts requests and validates JWT
│   └── FarmVerseUserDetailsService.java    # Loads user by email for Spring Security
├── util/
│   └── JwtUtil.java                # JWT generate, extract, validate
├── exception/
│   ├── GlobalExceptionHandler.java
│   ├── ResourceNotFoundException.java
│   ├── BadRequestException.java
│   ├── ConflictException.java
│   ├── ForbiddenException.java
│   ├── UnauthorizedException.java
│   └── ApiErrorResponse.java
└── FarmVerseApplication.java       # Main entry point
```

---

## Database
- Host: Clever Cloud MySQL (free tier — max 5 connections)
- Database: `bnwoibw6wf8mqzipy8kt`
- Tables: `users`, `farms`, `crops`
- Tables are auto-created by Hibernate (`ddl-auto=update`)

### Table Relationships
```
users (1) ──── (many) farms (1) ──── (many) crops
```
- One user can own many farms
- One farm can have many crops

---

## Configuration (application.properties)
```properties
spring.datasource.url=jdbc:mysql://bnwoibw6wf8mqzipy8kt-mysql.services.clever-cloud.com:3306/bnwoibw6wf8mqzipy8kt?useSSL=true&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=ua7aumsyja28emev
spring.datasource.hikari.maximum-pool-size=2
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.transaction-isolation=TRANSACTION_READ_COMMITTED
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=farmverse-super-secret-key-for-jwt-signing-2024-precision-agriculture
app.jwt.expiration-ms=86400000
```
- Pool size kept at 2 due to Clever Cloud free tier limit of 5 connections
- JWT token expires in 24 hours (86400000 ms)

---

## Authentication Flow
1. User registers via `POST /api/auth/register`
2. Password is hashed using BCrypt before saving to DB
3. User logs in via `POST /api/auth/login`
4. Server validates credentials and returns a JWT token
5. Client sends the token in every subsequent request as:
   `Authorization: Bearer <token>`
6. `JwtAuthenticationFilter` intercepts each request, extracts and validates the token
7. If valid, the user is authenticated and the request proceeds

---

## API Endpoints

### Auth (No token required)

| Method | URL | Description |
|--------|-----|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT token |

#### Register Request Body
```json
{
  "username": "john",
  "email": "john@example.com",
  "password": "password123",
  "role": "FARMER"
}
```

#### Login Request Body
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login Response
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "role": "FARMER"
}
```

---

### Users (Token required)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/{id}` | Get user by ID |
| POST | `/api/users` | Create a user |
| PUT | `/api/users/{id}` | Update a user |
| DELETE | `/api/users/{id}` | Delete a user |

---

### Farms (Token required)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/farms` | Get all farms |
| GET | `/api/farms/{id}` | Get farm by ID |
| POST | `/api/farms` | Create a farm |
| PUT | `/api/farms/{id}` | Update a farm |
| DELETE | `/api/farms/{id}` | Delete a farm |

#### Farm Request Body
```json
{
  "farmName": "Green Farm",
  "location": "Cairo",
  "area": 50.5,
  "ownerId": 1
}
```

---

### Crops (Token required)

| Method | URL | Description |
|--------|-----|-------------|
| GET | `/api/crops` | Get all crops |
| GET | `/api/crops/{id}` | Get crop by ID |
| POST | `/api/crops` | Create a crop |
| PUT | `/api/crops/{id}` | Update a crop |
| DELETE | `/api/crops/{id}` | Delete a crop |

#### Crop Request Body
```json
{
  "cropName": "Wheat",
  "season": "Winter",
  "farmId": 1
}
```

---

## How to Run the Backend

1. Make sure MySQL client is installed (for DB access if needed)
2. Kill any process on port 8080:
```
FOR /F "tokens=5" %P IN ('netstat -ano ^| findstr :8080 ^| findstr LISTENING') DO taskkill /PID %P /F
```
3. Navigate to BackEnd folder and run:
```
cd BackEnd
mvn spring-boot:run
```
4. Wait for `Started FarmVerseApplication` in the console
5. Backend is running at `http://localhost:8080`

---

## Testing Order in Postman
1. Register a user
2. Login to get JWT token
3. Copy token and add to all subsequent requests as `Authorization: Bearer <token>`
4. Create a Farm (use the user ID as ownerId)
5. Create a Crop (use the farm ID as farmId)
6. Test GET, PUT, DELETE as needed
