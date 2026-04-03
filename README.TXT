##NOTE FOR ENVIORNMENT VARIABLE

Due to security reasons the MongoDB slot is there in .env file but 
url is not present. So for making if work anyone can use his or her own 
MongoDB URL.

 
#backend 
#  Finance Dashboard API

A robust backend API for 
managing personal financial records,
built with Node.js, Express, and MongoDB.
This project includes authentication, role-based access control,
transaction management, and advanced dashboard analytics.

---
## Features

* JWT-based Authentication (Register/Login)
* Role-Based Access Control (Viewer, Analyst, Admin)
* Financial Records Management (CRUD operations)
* Dashboard Analytics (income, expenses, trends)
* Pagination, Filtering & Sorting
* Input Validation using express-validator
* Soft Delete support for records
*  Centralized Error Handling

---

##  Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT)
* **Validation:** express-validator

---

## Project Structure

```
finance-dashboard/
│
├── config/
│   └── db.js
│
├── controllers/
│   ├── authControllers.js
│   ├── userController.js
│   ├── recordController.js
│   └── dashboardController.js
│
├── middleware/
│   └── auth.js
│
├── models/
│   ├── User.js
│   └── FinancialRecord.js
│
├── routes/
│   ├── authRoutes.js
│   ├── userRoutes.js
│   ├── recordRoutes.js
│   └── dashboardRoutes.js
│
├── .env
├── server.js
└── package.json
```

---

##  Setup Instructions

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd finance-dashboard
```

### 2. Install dependencies

```bash
npm install
```

### 3. Create `.env` file

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
ADMIN_SECRET_KEY = ADMIN_key
```

### 4. Run the server

```bash
npm start
```

Server will run on:

```
http://localhost:5000
```

---

##  Authentication APIs

### Register

```
POST /api/auth/register
```

### Login

```
POST /api/auth/login
```

---

## User Management (Admin Only)

### Get all users

```
GET /api/users
```

### Get user by ID

```
GET /api/users/:id
```

### Update role

```
PUT /api/users/:id/role
```

### Update status

```
PUT /api/users/:id/status
```

### Delete user

```
DELETE /api/users/:id
```

---

##  Financial Records APIs

### Create record

```
POST /api/records
```

### Get all records (with filters & pagination)

```
GET /api/records?page=1&limit=10&type=income&category=food
```

### Get record by ID

```
GET /api/records/:id
```

### Update record

```
PATCH /api/records/:id
```

### Delete record (soft delete)

```
DELETE /api/records/:id
```

---

##  Dashboard API

### Get summary

```
GET /api/dashboard/summary
```

### Returns:

* Total Income
* Total Expenses
* Net Balance
* Category-wise breakdown
* Recent activity
* Monthly trends

---

##  Role-Based Access

| Role    | Permissions                   |
| ------- | ----------------------------- |
| Viewer  | Read own records              |
| Analyst | Read + create/update records  |
| Admin   | Full access (users + records) |

---

##  Key Design Decisions

* **Soft Delete:** Records are not permanently deleted (`isDeleted` flag)
* **RBAC:** Middleware-based role restriction
* **Ownership Control:** Users can only access their own records (viewer role)
* **Aggregation:** MongoDB aggregation used for analytics
* **Pagination:** Efficient data handling for large datasets

---

##  Error Handling

* Centralized error middleware
* Handles:

  * Validation errors
  * Duplicate fields
  * JWT errors
  * Server errors

---

## Assumptions

* Default user role is `viewer`
* Only admins can manage users
* Financial data is user-specific
* Dates are stored in ISO format


## Admin Access
* A ADMIN_SECRET_KEY is needed during registration for anyone
to become an admin.

---

## Future Improvements

* Frontend integration (React)
* Export reports (PDF/CSV)
* Advanced analytics & charts
* Caching for performance
* Unit & integration testing

---
Tradeoffs & Design Decisions

- Soft delete is used instead of permanent deletion to preserve historical data, at the cost of slightly more complex queries.
- Role-based access control is kept simple (viewer/admin) to maintain clarity and avoid over-engineering.
- Aggregation is used for dashboard analytics instead of caching, prioritizing real-time data over performance optimization.
- Validation is handled at the route level using express-validator for simplicity instead of a separate validation layer.
---

##  Conclusion

This project demonstrates strong backend fundamentals including API design, authentication, 
database modeling, and real-world problem solving through financial data management.

---
