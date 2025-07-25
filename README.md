# SkillHub 🧠💬

**SkillHub** is a real-time platform that allows users to create, join, and chat in skill-based learning sessions. Built with the **MERN stack** and Socket.io for real-time communication.

---

## 🚀 Features

- 🔐 User authentication (Login)
- 📚 Browse and join skill-sharing sessions
- 💬 Real-time group chat per session
- ✅ Message seen indicators
- 😊 Emoji reactions and picker
- 📁 File uploads (images, docs)
- 🔔 Message notification sounds

---

## 🛠️ Tech Stack

| Frontend | Backend |
|----------|---------|
| React + Vite | Express.js + Node.js |
| Tailwind CSS | MongoDB + Mongoose |
| Socket.io | JWT Auth |
| Emoji Mart | Multer (for uploads) |

---

## 📦 Setup

### Prerequisites:
- Node.js
- MongoDB (local or cloud like MongoDB Atlas)

### Backend Setup:

```bash
cd backend
npm install
cp .env.example .env  # Update your Mongo URI and JWT secret
npm run dev
```

### Frontend Setup:

```bash
cd frontend
npm install
npm run dev
```

### Env Variables (frontend):
Create a `.env` file in `frontend/`:
```
VITE_BACKEND_URL=http://localhost:5000
```

---

## 🧪 Testing the App

- Register/Login
- Join a session
- Chat in real-time with another user or incognito window
- Upload files and send emoji reactions
- Watch for "Seen by" and "typing…" indicators

---

## 🌐 Deployment

- **Frontend** → [Vercel](https://vercel.com)
- **Backend** → [Render](https://render.com) or [Railway](https://railway.app)

---

## 🙌 Acknowledgments

Built for the **PLP MERN Capstone Project**  
Developed by Mpho Gatsheni (Gatsheni528)

---

## 📬 Contact

Feel free to connect on [LinkedIn](https://linkedin.com) or [GitHub](https://github.com/Gatsheni528)
