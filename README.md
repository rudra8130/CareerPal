# CareerPal 🚀

CareerPal is an intelligent, AI-powered career assistant designed to help developers and job seekers land their dream jobs. By leveraging advanced Language Models and a robust microservices architecture, CareerPal provides personalized resume analysis, real-time AI mock interviews, and tailored learning roadmaps.

## ✨ Key Features

- **🗣️ Real-Time AI Mock Interviews**: Practice your interview skills with an interactive AI that listens to your speech in real-time, provides immediate feedback, and adapts to your chosen difficulty and tech stack. Features an integrated code editor for technical rounds.
- **📄 AI Resume Builder & Analyzer**: Upload your resume and let the AI parse, evaluate, and provide actionable feedback. Get a calculated ATS score and discover missing skills for your target role.
- **🗺️ Personalized Learning Roadmaps**: Generate step-by-step learning paths tailored to your target salary and role. Each roadmap includes curated YouTube tutorials, documentation links, and estimated completion times.
- **🪙 Interview Coin System**: Built-in gamified credit system for conducting AI interviews and generating roadmaps.

## 🏗️ Architecture

CareerPal is built on a scalable **Microservices Architecture** to ensure high availability and separation of concerns.

- **Frontend**: React (Vite) client handling the UI/UX.
- **API Gateway**: Express proxy handling authentication and routing requests to appropriate microservices.
- **Auth Service**: Manages user authentication (via Firebase) and session management (Redis).
- **Resume Service**: Handles PDF parsing and AI-driven resume evaluation.
- **Interview Service**: Manages stateful AI mock interviews using LangGraph.
- **Roadmap Service**: Generates structured learning paths and fetches relevant external resources using LangChain agents.

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS, Framer Motion, Vite
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Atlas)
- **Caching & Sessions**: Redis
- **AI & ML**: LangChain, LangGraph, Groq API (Llama3/Mixtral)
- **Authentication**: Firebase Admin SDK
- **Containerization**: Docker & Docker Compose (for microservices)

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Docker](https://www.docker.com/) (Optional, but recommended for running the backend stack)
- [Redis](https://redis.io/) (If running locally without Docker)
- API Keys: Firebase Admin SDK JSON, Groq API Key, YouTube Data API Key

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/CareerPal.git
   cd CareerPal
   ```

2. **Setup Environment Variables**
   Create `.env` files in each microservice directory (`gateway`, `services/auth`, `services/resume`, `services/interview`, `services/roadmap`) and the `frontend` directory based on the required keys for that service.

3. **Run the Backend Microservices**
   You can either start them manually or use Docker Compose.
   
   **Using Docker Compose (Recommended)**:
   ```bash
   cd Backend
   docker compose up --build
   ```

   **Using NPM (Manual)**:
   You will need to run `npm install` and `npm run dev` in the `gateway` and every folder inside `services/`.

4. **Start the Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

5. **Open the Application**
   Visit `http://localhost:5173` in your browser. (Note: For the microphone dictation to work optimally, we recommend using Google Chrome or Microsoft Edge).

## 💡 How to Use

1. **Sign in**: Authenticate using your Google account via Firebase.
2. **Upload Resume**: Navigate to the Resume Builder to upload your PDF and receive instant AI feedback.
3. **Generate Roadmap**: Head to the Roadmaps section, input your target role and target package, and get a complete study guide.
4. **Start an Interview**: Spend your Interview Coins to launch an AI interview session. Enable your microphone, and practice answering technical and behavioral questions in real-time.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.


