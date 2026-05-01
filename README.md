🤝 Collab AI: Interactive Team Performance Workspace
License React TypeScript Firebase Gemini

📌 Overview
Collab AI is a modern, intelligent web application engineered for team task management and performance tracking. Set against a fluid glassmorphism interface, it empowers teams to streamline agile workflows, map extensive roadmaps, and monitor metric-driven goals. Integrated with Google Gemini AI and real-time backend synchronization, Collab AI provides a centralized, secure environment optimized for high-performing, cross-functional teams to collaborate efficiently.

✨ Key Features
🧠 Intelligent AI Assistance: Utilize advanced machine learning models via the Google GenAI SDK to contextualize projects, plus built-in microphone integrations for hands-free workflow capabilities.
📋 Agile Kanban Boards: Feature-rich drag-and-drop task management dynamically synchronized across your team to keep sprint planning seamless and intuitive.
📊 Goal Tracking & Analytics: Interactive dashboards populated with responsive data visualization charts to track project health and departmental progression.
👥 Multi-Team Architecture: Effortlessly switch contexts between multiple active teams with separated environments and granular permission guards for Team Leads and Members.
📄 One-Click Report Exports: Easily turn current board views or project roadmaps into downloadable PDF documents for offline stakeholder presentation.
🎨 Premium Interface Design: A beautiful, highly accessible UI presenting elegant glassmorphism layers and fluid, physics-based motion transitions.

🛠️ Tech Stack
Frontend Framework: React 19 + TypeScript + Vite
Styling & UI: Tailwind CSS v4, Motion (Animations), Lucide React (Icons)
Data Visualization: Recharts
Drag & Drop Engine: Hello Pangea DnD
Backend & Database: Firebase (Authentication, Cloud Firestore)
AI Integration: Google GenAI SDK (@google/genai)
Export Capabilities: jsPDF, html2pdf.js

🚀 Getting Started
1. Prerequisites
Ensure you have the following installed on your local machine:

Node.js (v18 or higher)
npm or yarn

2. Installation
Clone the repository and install the required dependencies:

git clone https://github.com/your-username/collab-ai.git
cd collab-ai
npm install

3. Environment Variables
Create a .env file in the root directory and add your API Keys and App URL:

VITE_GEMINI_API_KEY="your_gemini_api_key_here"
VITE_APP_URL="http://localhost:3000"

Configure your Firebase credentials in src/firebase.ts (or firebase-applet-config.json based on your setup).

4. Run the Development Server
npm run dev

The application will be available at http://localhost:3000.

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

Fork the Project
Create your Feature Branch (git checkout -b feature/AmazingFeature)
Commit your Changes (git commit -m 'Add some AmazingFeature')
Push to the Branch (git push origin feature/AmazingFeature)
Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
