> ⚠️ This is a proprietary project. Unauthorized copying, reproduction, or academic submission of this work is strictly prohibited.

# 📦 LocateX – The Smart Lost and Found Solution

LocateX is a **full-stack web application** designed to bridge the gap between people who have lost items and those who have found them within an institution. By digitizing the traditional notice-board method, it provides a **secure, efficient, and transparent platform** for item recovery.

---

## 🚀 Key Features

### 🔍 Smart Match Engine
Automatically notifies users when a **"Found"** item matches the description of a **"Lost"** item.

### 🔐 Secure Claim System
Owners must submit proof of ownership, which finders manually review before contact details are revealed.

### 🛡️ Privacy-First
User contact information remains hidden until a claim is officially approved.

### 📊 Dashboard Analytics
Users can track the status of their reported items and pending claims in real-time.

---

## 🛠️ Tech Stack

### Frontend
- EJS (Embedded JavaScript)
- HTML5
- CSS3
- Bootstrap

### Backend
- Node.js
- Express.js

### Database
- MongoDB Atlas (NoSQL) 
//You can use MongoDB compass to handle data locally on your system

### Authentication
- Bcrypt.js (Password Hashing)
- Express-Session (State Management)

### Image Handling
- Multer (Secure File Uploads)
// I have recently got an alternative to multer which can be used to use image anywhere using Cloudinary

---

## 📋 System Requirements

### 💻 Hardware
- **RAM:** Minimum 4GB (8GB Recommended)
- **Processor:** Intel i3 or Equivalent
- **Storage:** 500MB Free Space

### 🧩 Software
- **Operating System:** Windows / Linux / macOS
- **Node.js:** v14.x or Higher
- **Database:** MongoDB (Local or Atlas Connection String)

---

## 🔧 Installation & Setup

### 1️⃣ Clone the Repository
### 2️⃣ Install Dependencies
npm install
### 3️⃣ Setup Environment Variables
Create a .env file in the root directory and add:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
### 4️⃣ Run the Application
npm start

---

## 🛡️ Security Implementation

- One-way password hashing using **Bcrypt**
- Session-based authorization for protected routes
- Input validation to prevent malformed or malicious data

---

## 📈 Future Scope

- 🤖 AI-based Image Recognition
- 📱 Mobile Application Development (Android / iOS)
- 📩 Real-time SMS & Email Alerts (Twilio / SendGrid)

---

## 🤝 Contribution

Contributions, issues, and feature requests are welcome!

---

---

## 📄 License & Usage Restriction

© 2026 Pralhad Saw. All Rights Reserved.

This project and its source code are proprietary and developed solely by the author.

🚫 You are NOT allowed to:
- Copy this project
- Modify and redistribute this project
- Use this project for commercial or academic submission
- Claim this project as your own work

✅ You are allowed to:
- View the project for learning and reference purposes only

For permission requests, contact the author.

---
