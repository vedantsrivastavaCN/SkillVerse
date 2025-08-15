# Study Notion

A full-stack EdTech platform for online learning, course creation, and student engagement. Built with the MERN stack, Study Notion provides a seamless experience for both instructors and learners.

---

## Table of Contents
- [Features](#features)
- [Folder Structure](#folder-structure)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Screenshots](#screenshots)
- [Contact](#contact)

---

## Features
- **User Authentication:** Secure login, signup, and JWT-based authentication.
- **Course Management:** Instructors can create, update, and manage courses, sections, and subsections.
- **Payment Integration:** Secure payments using Razorpay.
- **Cloudinary Integration:** Image and video uploads for course content.
- **Email Notifications:** Automated emails for verification, enrollment, and password reset.
- **Student Dashboard:** Track course progress, view enrolled courses, and manage profile.
- **Ratings & Reviews:** Students can rate and review courses.
- **Contact Us:** Users can send queries directly from the platform.
- **Responsive UI:** Modern, mobile-friendly design with Tailwind CSS.

---

## Folder Structure
```
BACKEND/
  |-- index.js
  |-- package.json
  |-- .env
  |-- config/
  |-- controllers/
  |-- mail/
  |-- middlewares/
  |-- models/
  |-- routes/
  |-- utils/

FRONTEND/
  |-- src/
      |-- App.js
      |-- index.js
      |-- assets/
      |-- Components/
      |-- data/
      |-- hooks/
      |-- pages/
      |-- reducers/
      |-- services/
      |-- slices/
      |-- utils/
  |-- public/
  |-- package.json
  |-- tailwind.config.js
```

---

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT
- **Payments:** Razorpay
- **Media Storage:** Cloudinary
- **Email:** Gmail SMTP

---

## Getting Started

### Prerequisites
- Node.js (v14+ recommended)
- npm or yarn
- MongoDB Atlas account
- Cloudinary account
- Razorpay account
- Gmail account (for SMTP)

### 1. Clone the Repository
```bash
git clone <repo-url>
cd STUDY-NOTION
```

### 2. Backend Setup
```bash
cd BACKEND
npm install
```

- Create a `.env` file in the `BACKEND` folder (see [Environment Variables](#environment-variables)).
- Start the backend server:
```bash
npm start
```

### 3. Frontend Setup
```bash
cd ../FRONTEND
npm install
npm start
```

- The frontend will run on `http://localhost:3000` by default.

---

---

## Scripts
- **Backend:**
  - `npm start` — Start the backend server
- **Frontend:**
  - `npm start` — Start the React development server

---

## Contact
**Developer:** Vedant Srivastava  
**Email:** vedantsrivastava42@gmail.com

Feel free to reach out for any queries, suggestions, or contributions!
