# Maricon Jane G. Laguting — Portfolio

<p align="center">
  <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" alt="HTML5" />
  <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white" alt="CSS3" />
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel" />
  <img src="https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white" alt="Gemini AI" />
</p>

A minimal, elegant personal portfolio website, Features a fully integrated **RAG-powered AI chatbot** that answers questions about Maricon's resume using Google's Gemini API.

---

## 🔗 Live Site

The project is deployed continuously via **Vercel**.

👉 **[View Live Portfolio](https://my-portfolio-liard-mu-wss90bmgrz.vercel.app/)**

---

## ✨ Features

- **🤖 RAG-Powered AI Chatbot** — Floating chat widget that uses Retrieval-Augmented Generation (RAG) to answer recruiter questions about Maricon's experience, skills, and projects. Powered by Google Gemini 3.5 Flash.
- **🎯 Custom Animated Cursor** — Smooth dot + outline follow effect that scales/reacts when hovering over interactive elements.
- **🌓 Adaptive Theme Engine** — Seamless Dark / Light mode toggle, persisting selection across browser sessions via `localStorage`.
- **✨ Scroll Reveal Animations** — Sections gracefully animate into view as you navigate down the page.
- **📱 Fluid Responsive Design** — Crafted using modern CSS Grid and Flexbox layouts for pixel-perfect presentation across all screen sizes.
- **✨ Glassmorphic Navigation** — Sticky frosted-glass navbar with active backdrop-blur filter.
- **💡 Tilt-on-Hover Interactions** — Premium card hover effects on experiences and projects using vanilla JavaScript 3D tilt.
- **🖼️ Experience Gallery** — Lightbox photo gallery showcasing moments from internship and work at SOFI AI Tech Solution Inc.

---

## 🗂️ Sections Overview

| Section | Content | Highlights |
| :--- | :--- | :--- |
| 🧑‍💻 **Hero / About** | Introduction & Professional Summary | Resume-accurate summary from BS Computer Engineering student at PUP. |
| 💼 **Experience** | Professional History | Detailed bullet-point breakdowns of roles at SOFI AI Tech Solution Inc. & TTEC. |
| 🚀 **Projects** | Selected Work | Showcase of IoT systems, RAG applications, AI chatbots, and custom DBMS. |
| 🖼️ **Gallery** | SOFI AI Experience | Photo gallery of professional milestones, team moments, and conferences. |
| 🧠 **Expertise** | Skill Mapping | Full list of core and technical skills from the resume (RAG, Networking, IoT, etc.). |
| 🎓 **Education** | Academic Background | BS Computer Engineering at PUP (GWA: 1.59, 2022–2026) & all 3 Cisco CCNA certifications. |
| 🤖 **AI Chatbot** | Resume-Aware Assistant | RAG chatbot with cosine-similarity retrieval over pre-embedded resume chunks. |

---

## 🛠️ Tech Stack & Dependencies

### Frontend
- **Structure:** Semantic HTML5
- **Styling:** CSS3 Custom Properties, Glassmorphism, CSS Transitions/Transforms
- **Logic:** Vanilla JavaScript (DOM manipulation, LocalStorage, Scroll Reveal, Interactive Cursor, Markdown Renderer)
- **Icons:** [Feather Icons](https://feathericons.com/)
- **Typography:** [Inter](https://fonts.google.com/specimen/Inter) & [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) via Google Fonts

### Backend (Vercel Serverless)
- **Runtime:** Node.js (Vercel Serverless Function)
- **AI Model:** Google Gemini 3.5 Flash (`gemini-3.5-flash`)
- **Embeddings:** Google `text-embedding-004` model
- **Vector Search:** Manual cosine similarity over pre-computed embeddings
- **Fallback:** Keyword-based search (offline/demo mode when no API key is set)

---

## 📁 Directory Structure

```text
portfolio/
├── index.html                  # Markup structure and semantic sections
├── styles.css                  # Core design tokens, layout styles, and animations
├── script.js                   # Cursor, theme switcher, scroll effects, chatbot UI + markdown renderer
├── package.json                # Node.js dependency config
├── README.md                   # Project documentation
├── api/
│   ├── chat.js                 # Vercel serverless function — RAG retrieval + Gemini generation
│   └── resume_data.json        # Pre-computed resume embeddings (vector database)
├── scripts/
│   └── generate_embeddings.js  # Script to regenerate resume_data.json with new embeddings
└── sofi-pics/                  # Gallery images from SOFI AI internship
```

---

## 🤖 How the RAG Chatbot Works

The chatbot uses a **Retrieval-Augmented Generation (RAG)** pipeline:

1. **Embedding Generation** (`scripts/generate_embeddings.js`): The resume is split into semantic chunks (Summary, Experience, Projects, Skills, Education, Certificates). Each chunk is embedded using the Gemini `text-embedding-004` model and saved to `api/resume_data.json`.

2. **Query Retrieval** (`api/chat.js`): When a user sends a message, the backend embeds the query and computes **cosine similarity** against all resume chunks to find the top 3 most relevant sections.

3. **Response Generation**: The retrieved chunks are injected into a prompt sent to **Gemini 3.5 Flash**, which generates a warm, concise, and contextually accurate answer.

4. **Demo/Offline Mode**: If no `GEMINI_API_KEY` is set, the backend falls back to keyword-based search and returns a labeled demo response.

---

## 🚀 Running Locally

> **Note:** The AI chatbot requires a Node.js backend. Use the Vercel CLI to test it locally.

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables
Create a `.env` file or set the variable in your shell:
```bash
GEMINI_API_KEY=your_key_here
```
Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).

### 3. Start the Local Dev Server
```bash
vercel dev
```
Then open `http://localhost:3000` in your browser.

### 4. (Optional) Regenerate Embeddings
If you update your resume content, re-run the embedding script:
```bash
npm run generate-embeddings
```

---

## ⚙️ Deployment

This project is deployed to **Vercel** and automatically aliased to the production URL.

### Manual Deploy
```bash
vercel --prod
```

### Environment Variables (Required for AI Chat)
Set the following in your Vercel Project Dashboard under **Settings → Environment Variables**:

| Key | Value |
| :--- | :--- |
| `GEMINI_API_KEY` | Your Google Gemini API key |

---

<p align="center">
  © 2026 Maricon Jane G. Laguting. All rights reserved.
</p>
