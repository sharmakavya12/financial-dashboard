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
``````
user Register
<img width="1912" height="724" alt="Screenshot 2026-04-03 105303" src="https://github.com/user-attachments/assets/4e8e00ad-092c-496c-bd46-6b939ae39fd5" />


Admin register
<img width="1859" height="954" alt="Screenshot 2026-04-03 105652" src="https://github.com/user-attachments/assets/9204e292-c0fc-4fa4-a484-2486d9d2194a" />


### Login

```
POST /api/auth/login

```````

Admin login
[Uploading Screenshot 2026-04-03 105827.png…]()

```

---

## User Management (Admin Only)

### Get all users

```
<img width="1905" height="986" alt="Screenshot 2026-04-03 110313" src="https://github.com/user-attachments/assets/686113d0-95f7-4317-9c3a-0d2c12bc4292" />

GET /api/users

<img width="1869" height="937" alt="Screenshot 2026-04-03 111700" src="https://github.com/user-attachments/assets/4266a447-e011-463a-a8e6-6f471a4689c2" />

### Get user by ID


GET /api/users/:id

<img width="1869" height="937" alt="Screenshot 2026-04-03 111700" src="https://github.com/user-attachments/assets/de34f994-d9e0-41fc-be46-aadde75ec05a" />

```

### Update role

```
PUT /api/users/:id/role
// before updation
<img width="1842" height="909" alt="image" src="https://github.com/user-attachments/assets/7a436432-2733-49ba-ac88-711c3ded4fdd" />

// after updation
<img width="1855" height="997" alt="image" src="https://github.com/user-attachments/assets/b35f2f03-0222-4c30-9f2a-6bc25e7cf09a" />


```

### Update status




```
PUT /api/users/:id/status

before
<img width="1847" height="918" alt="image" src="https://github.com/user-attachments/assets/8de1e564-77f5-4246-8996-a36cf34edeea" />

after
<img width="1868" height="947" alt="image" src="https://github.com/user-attachments/assets/f87cefec-76d3-47ce-9823-08fba167e842" />

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

<img width="1866" height="950" alt="image" src="https://github.com/user-attachments/assets/4279fe69-783e-4993-accd-a35f3ad14727" />

```

### Get all records
``````
<img width="1859" height="966" alt="image" src="https://github.com/user-attachments/assets/aeb5bc66-c18f-43e0-8cdc-69658358a099" />

```
 (with filters & pagination)
``````
GET /api/records?page=1&limit=1
<img width="1849" height="934" alt="image" src="https://github.com/user-attachments/assets/ba552df5-15d9-41a3-b55e-18b67f641d01" />

```

### Get record by ID

```
GET /api/records/:id
<img width="1852" height="973" alt="image" src="https://github.com/user-attachments/assets/3a34e58c-5e40-4386-8bff-43001c38e3f9" />

```

### Update record

```
PATCH /api/records/:id
<img width="1666" height="966" alt="image" src="https://github.com/user-attachments/assets/1e85dd96-af0e-4db1-a7ef-df55c5f3f40e" />

```

### Delete record (soft delete)

```
DELETE /api/records/:id
<img width="1696" height="859" alt="image" src="https://github.com/user-attachments/assets/c2465317-7543-4a84-b0be-d19cf05a0c7a" />


```

---

##  Dashboard API

### Get summary


```
GET /api/dashboard/summary
<img width="1630" height="944" alt="image" src="https://github.com/user-attachments/assets/1e12826c-1258-4342-a1e0-4c23ec7f1416" />

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
