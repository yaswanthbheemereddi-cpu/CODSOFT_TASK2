# CODSOFT_TASK2: Contact Management System API

![Node.js](https://img.shields.io/badge/Node.js-v24-green.svg)
![Express](https://img.shields.io/badge/Express-4.21-blue.svg)
![Database](https://img.shields.io/badge/Database-SQLite-lightgrey.svg)
![Status](https://img.shields.io/badge/CodSoft-Backend%20Internship-orange.svg)

A scalable, secure Contact Management RESTful backend application built for **CodSoft Backend Development Internship (Task 2)**. Enables users to manage personal and professional contacts with duplicate entry protection, comprehensive validation, multi-field search, category filtering, sorting, pagination, and real-time dashboard testing.

---

## 👨‍💻 Developer Information
- **Intern Name**: Bheemereddi Yaswanth Durga Bose
- **Domain**: Backend Development
- **Batch**: SEPT BATCH C24
- **Organization**: [CodSoft](https://www.codsoft.in)

---

## 🌟 Key Features
- **Duplicate Prevention Engine**: Automatic conflict detection ensuring no two contacts have identical emails or phone numbers (`409 Conflict`).
- **Comprehensive Contact Profile**: Supports `name`, `email`, `phone`, `company`, `job_title`, `address`, `category` (personal/work/other), and `is_favorite` starring.
- **Search & Multi-Filter**:
  - Full-text search across name, email, phone number, and company.
  - Category filtering (`work`, `personal`, `other`).
  - Favorites toggle filter.
- **Sorting & Server-Side Pagination**: Sort dynamically by name, company, or date created in ASC/DESC order.
- **Input Validation**: Validates email format, phone numbers (7–15 digits), and mandatory fields using custom middleware.
- **Clean Scalable Architecture**: Follows MVC pattern with controllers, routes, models, configuration, and middleware separation.
- **Interactive UI Dashboard**: Modern embedded UI at `http://localhost:3002` to visually demo create, edit, star, delete, and search in live video.
- **Postman Collection**: `postman_collection.json` included for API testing.

---

## 📂 Project Architecture

```
CODSOFT_TASK2/
├── package.json               # Dependencies & project scripts
├── .env.example               # Environment variables example
├── .gitignore                 # Git ignore file
├── postman_collection.json    # Ready-to-use Postman test requests
├── README.md                  # Detailed docs & LinkedIn presentation script
└── src/
    ├── app.js                 # Express app initialization
    ├── server.js              # Server listener
    ├── config/
    │   └── database.js        # SQLite database connection & seed data
    ├── middleware/
    │   ├── errorHandler.js    # Error formatting & duplicate detector
    │   └── validator.js       # Payload validation middleware
    ├── models/
    │   └── contactModel.js    # Contact queries, search, & pagination
    ├── controllers/
    │   └── contactController.js # Business logic & HTTP responses
    ├── routes/
    │   └── contactRoutes.js   # Contact API routes
    └── public/                # Live interactive demo dashboard
        ├── index.html
        ├── style.css
        └── app.js
```

---

## 🛠️ Technology Stack
- **Runtime**: Node.js (v18+)
- **Framework**: Express.js
- **Database**: SQLite (Node.js Native `node:sqlite`)
- **Logging**: Morgan
- **Security & Headers**: CORS, Input Validation

---

## 🚀 Getting Started

### 1. Installation
```bash
# Navigate to project directory
cd CODSOFT_TASK2

# Install dependencies
npm install
```

### 2. Run the Server
```bash
npm start
```

The server will start at:
- **API Base URL**: `http://localhost:3002`
- **Interactive Web UI**: `http://localhost:3002`
- **Health Check**: `http://localhost:3002/api/health`

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/contacts` | Retrieve contacts (supports `?search=`, `?category=`, `?is_favorite=`, `?page=`, `?limit=`, `?sortBy=`) |
| `GET` | `/api/contacts/:id` | Get contact by ID |
| `POST` | `/api/contacts` | Add new contact (validates duplicate email/phone) |
| `PUT` | `/api/contacts/:id` | Update contact information |
| `PATCH`| `/api/contacts/:id/favorite` | Toggle favorite star status |
| `DELETE`| `/api/contacts/:id` | Delete contact record |

#### Sample Create Contact Request (`POST /api/contacts`):
```json
{
  "name": "Yaswanth Bose",
  "email": "yaswanth@codsoft.dev",
  "phone": "+91 9876543210",
  "company": "CodSoft",
  "job_title": "Backend Developer",
  "address": "Hyderabad, India",
  "category": "work",
  "is_favorite": 1
}
```

---

## 🎥 LinkedIn Video Presentation Script

> *"Hello everyone! I am excited to share **Task 2: Contact Management System API** of my Backend Development Internship at CodSoft.*
>
> *This backend service is built using **Node.js, Express.js, and SQLite**.*
>
> *Key Highlights:*
> 1. *Implemented a complete Contact model with duplicate prevention for both email and phone numbers.*
> 2. *Integrated search across name, email, phone, and company, alongside category filtering and sorting.*
> 3. *Built server-side pagination to efficiently handle large contact directories.*
> 4. *Equipped with an interactive live testing dashboard showing instant updates, starring favorites, and CRUD operations.*
>
> *Thank you to @CodSoft for this practical backend learning experience!"*

### LinkedIn Post Template:
```text
🌟 Excited to present Task 2 of my Backend Development Internship at CodSoft!

📌 Project: Contact Management System REST API
🛠️ Tech Stack: Node.js, Express.js, SQLite, REST Architecture

Highlights:
✅ Duplicate contact prevention on email & phone
✅ Search across names, emails, and phone numbers
✅ Category classification (Work, Personal, Other) and Favorites toggle
✅ Server-side pagination and sorting
✅ Modular MVC architecture & comprehensive error handling

GitHub Repository: <YOUR_GITHUB_REPO_URL>

Thank you @CodSoft for this hands-on project experience!

#codsoft #cip #internship #backenddevelopment #nodejs #expressjs #webdevelopment
```

---
Licensed under [MIT](LICENSE).
