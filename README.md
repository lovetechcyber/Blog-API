
# 📝 Blog API – Nobzo Technical Evaluation

## 📌 Project Overview
This project is a RESTful Blog API built as part of the Backend Developer technical evaluation for **Nobzo Ent**.  
It demonstrates backend fundamentals including authentication, authorization, data modeling, filtering, pagination, and clean API design using Node.js and MongoDB.

The API allows users to register, authenticate, create blog posts, manage their own drafts, and publish posts that are publicly accessible.

---

## 🛠 Tech Stack
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt
- JavaScript

---

## 📁 Project Structure
```
src/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── utils/
├── app.js
└── server.js
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/lovetechcyber/blog-api.git
cd blog-api
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure environment variables
Create a `.env` file in the root directory:

```env
MONGODB_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your_jwt_secret
PORT=5000
```


### 4️⃣ Run the project
```bash
npm run dev
```

Server will start on:
```
http://localhost:5000
```

---

## 🔐 Authentication

### Register
**POST** `/api/auth/register`
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

### Login
**POST** `/api/auth/login`
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "token": "JWT_TOKEN_HERE"
}
```

Use token in header:
```
Authorization: Bearer <token>
```

---

## 📝 Post Endpoints

### Create Post (Authenticated)
**POST** `/api/posts`
```json
{
  "title": "My First Blog",
  "content": "This is my first post",
  "tags": ["tech", "node"],
  "status": "published"
}
```

### Get Public Posts
**GET** `/api/posts`

Supports:
- page
- limit
- search
- tag
- author
- status (authenticated users only)

### Get Single Published Post
**GET** `/api/posts/:slug`

### Update Post (Author Only)
**PUT** `/api/posts/:id`

### Delete Post (Soft Delete – Author Only)
**DELETE** `/api/posts/:id`

---

## 🔎 Authorization Rules
- Any authenticated user can create posts
- Only post author can update or delete
- Public users can view published posts only
- Authenticated users can view their own drafts
- Posts use soft delete (`deletedAt`)

---

## 📦 Environment Variables
| Variable | Description |
|--------|------------|
| MONGODB_URI | MongoDB connection string |
| JWT_SECRET | JWT secret |
| PORT | Server port |

---

## 👤 Author
Prince Okwubali  
