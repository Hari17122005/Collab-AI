🤝 Collab AI: Team Task Management & Performance Platform
License React TypeScript Firebase Gemini

📌 Overview
Collab AI is a modern, interactive web application designed to streamline team task management, goal tracking, and project roadmaps. Powered by Google Gemini AI, Collab AI enables teams to organize workflows, visualize progress, and boost productivity using an intuitive, responsive glassmorphism interface.

✨ Key Features
🧠 AI-Powered Insights: Leverage advanced machine learning models (Google Gemini) to interact with an AI assistant for task planning and workflow suggestions.
📋 Dynamic Kanban Boards: Manage tasks efficiently with intuitive drag-and-drop boards built for collaborative, agile environments.
🎯 Goal & Roadmap Tracking: Set team objectives, visualize project roadmaps, and track long-term milestones seamlessly.
🔒 Role-Based Access Control: Securely manage team permissions with defined roles (e.g., Team Lead vs. Members) and dedicated protection settings.
📈 Interactive Dashboards: Uncover productivity trends and insights using dynamic data visualization charts (powered by Recharts).
👥 Multi-Team Architecture: Switch actively between multiple teams without losing membership or historical context.

🛠️ Tech Stack
Frontend Framework: React 19 + TypeScript + Vite
Styling & UI: Tailwind CSS v4, Motion (Animations), Lucide React (Icons)
Data Visualization: Recharts
Drag and Drop: @hello-pangea/dnd
Backend & Database: Firebase (Authentication, Cloud Firestore)
AI Integration: Google GenAI SDK (@google/genai)

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
Create a .env file in the root directory and add your necessary API Keys:

VITE_GEMINI_API_KEY="your_gemini_api_key_here"

Configure your Firebase credentials in the required firebase configuration files based on your setup.

4. Run the Development Server
npm run dev

The application will be available at http://localhost:3000.

🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the Project
2. Create your Feature Branch (git checkout -b feature/AmazingFeature)
3. Commit your Changes (git commit -m 'Add some AmazingFeature')
4. Push to the Branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

📄 License
Distributed under the MIT License. See LICENSE for more information.
