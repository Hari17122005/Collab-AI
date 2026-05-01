# 🤝 Collab AI: Intelligent Team Management Platform

## 📌 Overview
Collab AI is a modern, interactive web application designed to streamline team task management, goal tracking, and performance analysis. Featuring a stunning glassmorphism design interface, the platform empowers teams to collaborate effectively with real-time updates, AI-driven insights, and intuitive Kanban boards.

## ✨ Key Features
- 🤖 AI-Powered Insights: Leverage Google Gemini AI to analyze team performance, provide smart recommendations, and automate repetitive tasks.
- 📋 Dynamic Kanban Boards: Effortlessly manage projects with interactive drag-and-drop boards to track tasks from creation to completion.
- 📊 Interactive Dashboards: Monitor team progress, active members, and overall productivity through beautifully visualized data charts.
- 🏢 Seamless Team Management: Create, join, and switch between multiple teams instantly with granular role-based access control (Team Lead and Member roles).
- 🛣️ Strategic Roadmapping: Plan and visualize long-term project milestones and company goals in a dedicated interactive space.
- 🔒 Secure Team Protection: Advanced team settings to manage access, invite members securely, and define workspace permissions.
- 📄 Direct PDF Exports: Instantly turn roadmaps and project reports into shareable PDF documents.

## 🛠️ Tech Stack
- Frontend Framework: React 19 + TypeScript + Vite
- Styling & UI: Tailwind CSS v4, Motion (UI Animations), Lucide React (Icons)
- State & Routing: React Router v7, React Context
- Drag and Drop: Hello Pangea DnD
- Backend & Database: Firebase (Authentication, Cloud Firestore real-time database)
- AI Integration: Google GenAI SDK
- Data Visualization: Recharts

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have the following installed on your local machine:
- Node.js (v18 or higher)
- npm or yarn

### 2. Installation
Clone the repository and install the required dependencies:

git clone https://github.com/your-username/collab-ai.git
cd collab-ai
npm install

### 3. Environment Variables
Create a .env file in the root directory and add your Google Gemini API Key and other configuration secrets:

VITE_GEMINI_API_KEY="your_gemini_api_key_here"

Configure your Firebase credentials inside your Firebase configuration file.

### 4. Run the Development Server

npm run dev

The application will be available at http://localhost:3000.

## 🤝 Contributing
Contributions are always welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## 📄 License
Distributed under the MIT License. See LICENSE for more information.
