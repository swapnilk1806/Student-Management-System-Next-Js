# 🎓 Student Management System

A simple and responsive Student Management System built using **Next.js, TypeScript, Tailwind CSS, and MySQL**. This application allows users to manage student records through a clean and user-friendly interface.

## 🚀 Features

- Add new student records
- View all registered students
- Update existing student information
- Delete student records
- Search students by name, email, or course
- MySQL database integration
- Responsive user interface
- Form validation and error handling

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| Next.js | Frontend and backend framework |
| TypeScript | Type-safe development |
| Tailwind CSS | Responsive styling |
| MySQL | Database |
| mysql2 | MySQL database connection |
| REST API | CRUD operations |

## 📁 Project Structure

```text
student-management/
├── app/
│   ├── api/
│   │   └── students/
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   └── StudentManager.tsx
├── lib/
│   ├── db.ts
│   └── validation.ts
├── public/
├── .env.local
├── .gitignore
├── package.json
└── README.md
```

## ⚙️ Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/swapnilk1806/Student-Management-System-Next-Js.git
cd Student-Management-System-Next-Js
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure MySQL

Make sure MySQL is installed and running on your system.

Open MySQL Workbench or your MySQL terminal and execute:

```sql
CREATE DATABASE IF NOT EXISTS student_db;

USE student_db;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    course VARCHAR(100) NOT NULL,
    age INT NOT NULL DEFAULT 18,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);
```

### 4. Configure environment variables

Create a `.env.local` file in the root directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=student_db
```

Replace `your_mysql_password` with your local MySQL password.

**Important:** Never upload your `.env.local` file or database credentials to GitHub.

### 5. Start the development server

```bash
npm run dev
```

Open your browser:

http://localhost:3000

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/students` | Get all students |
| GET | `/api/students/:id` | Get a student by ID |
| POST | `/api/students` | Add a new student |
| PUT | `/api/students/:id` | Update a student |
| DELETE | `/api/students/:id` | Delete a student |

### Example Student Data

```json
{
  "name": "Rahul Patil",
  "email": "rahul@example.com",
  "course": "Computer Science",
  "age": 22
}
```

## 📸 Screenshots

Add screenshots of your application here:

### Dashboard

![Student Management System Dashboard](screenshots/dashboard.png)

### Add Student

![Add Student Form](screenshots/add-student.png)

### Student Records

![Student Records Table](screenshots/student-records.png)

## 👨‍💻 Author

**Swapnil Kadam**

- GitHub: [swapnilk1806](https://github.com/swapnilk1806)
- Portfolio: [My Portfolio](https://swapnilk1806-portfolio.vercel.app/)
- LeetCode: [swapnilk1806](https://leetcode.com/u/swapnilk1806/)

## 📄 License

This project is open-source and available under the [MIT License](https://opensource.org/licenses/MIT).

---

⭐ If you find this project useful, consider giving it a star on GitHub.

**Thank you for visiting my project!**
