# mini-project-II

# 🎓 College Community Help Desk System

A modern, centralized platform built with the **MERN & Spring Boot** stack to bridge the communication gap between students, faculty, and college administration.

<div align="center">
  <img src="https://img.shields.io/badge/-Next_JS-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="nextdotjs" />
  <img src="https://img.shields.io/badge/-Spring_Boot-black?style=for-the-badge&logoColor=white&logo=springboot&color=6DB33F" alt="springboot" />
  <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=white&logo=mongodb&color=47A248" alt="mongodb" />
  <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="typescript" />
  <img src="https://img.shields.io/badge/-Tailwind_CSS-black?style=for-the-badge&logoColor=white&logo=tailwindcss&color=06B6D4" alt="tailwindcss" />
</div>

---

## 📋 Table of Contents
1. 🤖 [Introduction](#introduction)
2. ⚙️ [Tech Stack](#tech-stack)
3. 🔋 [Features](#features)
4. 🤸 [Quick Start](#quick-start)
5. 📂 [Project Structure](#structure)
6. 🚀 [Deployment](#deployment)

---

## 🤖 <a name="introduction">Introduction</a>

In most colleges, students struggle to get verified information regarding exams, fees, and timetables. Often, they have to visit offices physically or rely on unverified rumors. 

**College Community Help Desk** is a centralized SaaS-style platform where students can post queries, and authorized seniors/faculty can provide official solutions. This reduces the workload on staff and ensures students get clear, correct information in real-time.

## ⚙️ <a name="tech-stack">Tech Stack</a>

- **Frontend**: React.js / Next.js, Tailwind CSS, ShadCN UI
- **Backend**: Java, Spring Boot
- **Database**: MongoDB (NoSQL)
- **Security**: JWT (JSON Web Tokens) for secure authentication
- **Tools**: Postman (API Testing), Git & GitHub

## 🔋 <a name="features">Features</a>

👉 **Smart Query System**: Students can post academic or non-academic questions.
👉 **Role-Based Access**: Secure login for Students, Seniors (Moderators), and Admins.
👉 **Centralized Notice Board**: Official announcements regarding fees, exams, and holidays.
👉 **Knowledge Base**: Previously answered questions are stored to avoid repetitive queries.
👉 **Real-time Updates**: Instant visibility of new notices and responses.
👉 **Responsive UI**: Financial-dashboard style interface that works on mobile, tablet, and desktop.

## 🤸 <a name="quick-start">Quick Start</a>

Follow these steps to set up the project locally.

**Prerequisites**
- [Node.js](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [Java JDK 17+](https://www.oracle.com/java/technologies/downloads/)
- [MongoDB](https://www.mongodb.com/try/download/community)

**1. Clone the Repository**
```bash
git clone [https://github.com/yourusername/college-help-desk.git](https://github.com/yourusername/college-help-desk.git)
cd college-help-desk
2. Backend Setup (Spring Boot)

Bash

cd backend
# Create application.properties and add your MongoDB URI
./mvnw spring-boot:run
3. Frontend Setup (React/Next.js)

Bash

cd frontend
npm install
npm run dev
4. Environment Variables Create a .env file in the root and add:

Code snippet

MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
NEXT_PUBLIC_API_URL=http://localhost:8080/api
📂 <a name="structure">Project Structure</a>
Plaintext

├── frontend/             # React/Next.js files (UI components)
│   ├── components/       # Reusable UI (ShadCN)
│   ├── lib/              # Helper functions & API calls
│   └── app/              # Main pages
├── backend/              # Spring Boot files (Logic)
│   ├── src/main/java/    # Java Controllers & Services
│   └── src/main/resources/ # Configurations
└── README.md             # Project documentation
🔗 <a name="links">Connect with us</a>
If you face any bugs or need assistance, feel free to open an Issue on GitHub.
