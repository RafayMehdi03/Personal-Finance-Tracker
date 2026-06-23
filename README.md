# HisaabKitaab — Personal Finance Tracker

HisaabKitaab is a full-stack personal finance tracker web application built with **React**, **Spring Boot**, **PostgreSQL**, and **JWT authentication**. It allows users to securely manage their expenses, incomes, optional budgets, reports, and account settings through a clean modern dashboard.

The project is designed for students, freelancers, and personal users who want a simple but powerful way to track their money.

---

## Features

### Authentication and Security

* User signup and login
* Gmail-only email validation
* Password validation
* JWT-based authentication
* Protected dashboard routes
* Remember Me option for 1-hour login session
* Logout functionality
* Change password from Settings page
* User-specific data isolation

---

## Expense Management

* Add expenses
* View recent expenses on Overview page
* View all expenses on Transactions page
* Edit expense records
* Delete expense records
* Sort expenses by:

  * Date
  * Amount
  * Category
* Expense amounts are visually highlighted

---

## Income Management

* Add income records
* View recent income on Overview page
* View all income records on Income page
* Edit income records
* Delete income records
* Sort income records by:

  * Date
  * Amount
  * Category
* Income amounts are visually highlighted

---

## Overview Dashboard

The Overview page is intentionally kept simple and user-friendly.

It shows:

* Total Income
* Total Expenses
* Current Balance
* Toggle between:

  * Expense mode
  * Income mode

When Expense mode is selected, users can add expenses and view recent expenses.

When Income mode is selected, users can add income and view recent income records.

---

## Optional Budget Planning

Budgets are optional. The application works normally even if a user does not create any budgets.

The Budget page allows users to:

* Create monthly category-wise budgets
* View spending progress against budget limits
* Delete budgets
* See friendly empty states if no budget is created

This feature is useful for users who want planning, but it does not affect reports or normal usage.

---

## Reports and Charts

The Reports page provides visual financial insights.

Reports include:

* Total Income
* Total Expenses
* Current Balance
* Income vs Expenses chart
* Expense by Category chart
* Income by Category chart
* Monthly Balance Trend chart

Reports work even if the user does not use the Budget feature.

---

## Settings

The Settings page includes:

* User profile information
* Email display
* JWT security status
* Change password feature
* Logout option

---

## Tech Stack

### Frontend

* React
* Vite
* React Router
* CSS
* Lucide React Icons
* Recharts

### Backend

* Java
* Spring Boot
* Spring Security
* JWT Authentication
* Spring Data JPA
* Hibernate

### Database

* PostgreSQL

### Tools

* Git
* GitHub
* Postman
* IntelliJ IDEA
* VS Code

---

## Project Structure

```text
Personal-Finance-Tracker/
│
├── backend/
│   ├── src/main/java/com/finance/tracker/
│   │   ├── config/
│   │   ├── controller/
│   │   ├── dto/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── security/
│   │   ├── service/
│   │   └── TrackerApplication.java
│   │
│   ├── src/main/resources/
│   │   └── application.properties
│   │
│   └── pom.xml
│
├── frontend-react/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## Backend Setup

### 1. Open backend folder

```bash
cd backend
```

### 2. Configure PostgreSQL

Open:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/postgres
spring.datasource.username=postgres
spring.datasource.password=123

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format-sql=true
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect

app.jwt.secret=ZmlybmFuY2Vvc19zdXBlcl9zZWNyZXRfa2V5XzIwMjZfc2VjdXJlX2FwcA==
app.jwt.expiration-ms=3600000
```

Update the database username and password according to your local PostgreSQL setup.

### 3. Run backend

```bash
mvn spring-boot:run
```

Backend will run on:

```text
http://localhost:8080
```

---

## Frontend Setup

### 1. Open frontend folder

```bash
cd frontend-react
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run frontend

```bash
npm run dev
```

Frontend will run on:

```text
http://localhost:5173
```

---

## API Endpoints

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Expenses

```text
GET    /api/expenses
POST   /api/expenses
PUT    /api/expenses/{id}
DELETE /api/expenses/{id}
```

### Income

```text
GET    /api/incomes
POST   /api/incomes
PUT    /api/incomes/{id}
DELETE /api/incomes/{id}
```

### Budgets

```text
GET    /api/budgets
POST   /api/budgets
PUT    /api/budgets/{id}
DELETE /api/budgets/{id}
```

### Settings

```text
PUT /api/settings/change-password
```

---

## Security

The application uses JWT authentication.

After successful login, the backend returns a JWT token. The frontend stores the token based on the Remember Me option:

* If Remember Me is selected, the token is stored for 1 hour.
* If Remember Me is not selected, the session is temporary.
* Protected API requests include the token in the Authorization header.

Example:

```text
Authorization: Bearer <JWT_TOKEN>
```

Each user can only access their own expenses, incomes, and budgets.

---

## Database Tables

Main database tables:

```text
users
expenses
incomes
budgets
```

Each financial record is linked to a specific user using `user_id`.

---

## How to Use

1. Create an account using a Gmail address.
2. Login to access the dashboard.
3. Add expenses from the Overview page.
4. Add income from the Overview page by switching to Income mode.
5. Manage all expenses from the Transactions page.
6. Manage all income records from the Income page.
7. Optionally create budgets from the Budgets page.
8. View charts and summaries from the Reports page.
9. Change password from the Settings page.

---

## Testing Checklist

The following features should be tested before final submission:

* Signup
* Login
* Remember Me
* Logout
* Change password
* Add expense
* Edit expense
* Delete expense
* Sort expenses
* Add income
* Edit income
* Delete income
* Sort income
* Create budget
* Delete budget
* Reports charts
* User-specific data separation

---

## Future Improvements

Possible future improvements include:

* Export reports as PDF
* Download transactions as CSV
* Add recurring expenses
* Add savings goals
* Add monthly reminders
* Add profile picture
* Add email verification
* Add forgot password feature
* Add dark/light theme toggle

---

## Project Status

The project currently includes all major features required for a complete personal finance tracker:

* Authentication
* Expense tracking
* Income tracking
* Optional budgets
* Reports
* Settings
* Modern responsive UI

---

## Author

Developed as a full-stack personal finance tracking system using React, Spring Boot, PostgreSQL, and JWT authentication.
