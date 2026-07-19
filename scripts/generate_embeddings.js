const fs = require('fs');
const path = require('path');
try {
    require('dotenv').config();
} catch (e) {
    // dotenv not installed, ignore
}

const chunks = [
    {
        id: "summary",
        title: "Professional Summary",
        content: "Maricon Jane G. Laguting is a Computer Engineering student from Polytechnic University of the Philippines (PUP) – Sta. Mesa with hands-on experience in AI solutions development, Retrieval-Augmented Generation (RAG), prompt engineering, and system automation. Experienced in building AI chatbots, API integrations, and IoT systems. Seeking opportunities to apply software engineering and AI development skills to real-world problems while contributing to innovative technology teams."
    },
    {
        id: "exp_junior_ai",
        title: "Junior AI Solutions Developer Experience at SOFI AI Tech",
        content: "Role: Junior AI Solutions Developer at SOFI AI Tech Solution Inc. from December 2025 to February 2026 in Quezon City, Metro Manila. Key contributions include:\n- Contributed to system improvements for file content extraction, handling PDF ligatures and markups.\n- Developed FAISS with OpenAI embeddings to optimize document retrieval.\n- Created real-time Google Sheet monitoring systems for RAG updates.\n- Built AI chatbots handling 100+ business inquiries with automated workflows, system prompts, system logic mapping, and state and flow management."
    },
    {
        id: "exp_intern_ai",
        title: "AI Solutions Developer Intern Experience at SOFI AI Tech",
        content: "Role: AI Solutions Developer Intern at SOFI AI Tech Solution Inc. from August 2025 to October 2025 in Quezon City, Metro Manila. Key contributions include:\n- Refined AI chatbots and conversational flows, managing prompt engineering for persona, tone, and identity.\n- Implemented complex AI guardrails and integrity rules to ensure safe, professional, and accurate automated interactions.\n- Integrated Google Sheets API for automated data fetching, saving, and updates within AI workflows.\n- Developed function-specific AI modules (application status inquiries, job position dictionaries, automated feedback handling).\n- Utilized API integrations like the Semaphore gateway to enable automated SMS notifications.\n- Designed advanced conversational triggers and logic for customer service (CSR) workflows, booking management, and lead generation."
    },
    {
        id: "exp_qa_intern",
        title: "AI Quality Assurance Intern Experience at SOFI AI Tech",
        content: "Role: AI Quality Assurance Intern at SOFI AI Tech Solution Inc. from July 2025 to September 2025 in Quezon City, Metro Manila. Key contributions include:\n- Performed comprehensive quality assurance (QA) testing on 10+ live projects to ensure functionality and user experience standards.\n- Conducted rigorous internal and external testing using test cases to find and resolve loops across 4+ ongoing projects.\n- Monitored and evaluated AI performance, providing actionable feedback to developers to refine response consistency and accuracy."
    },
    {
        id: "exp_tech_support",
        title: "Technical Support Intern Experience at TTEC",
        content: "Role: Technical Support Intern at TTEC from July 2024 to September 2024 in Quezon City, Metro Manila. Key contributions include:\n- Provided real-time technical support to production floor agents, resolving audio hardware, peripheral, cables, power, and workstation connectivity issues to minimize downtime.\n- Executed PC and laptop re-imaging and reformatting for deployment.\n- Managed hardware asset lifecycles, performing data sanitization (Kill disk) and preparing inventory.\n- Maintained detailed administrative records processing RAF and HAF forms.\n- Assisted in IT office audit preparations by organizing storage systems and verifying peripheral functionality."
    },
    {
        id: "project_health",
        title: "IoT Health Management System Project",
        content: "Project: IoT-Based Health Management System with Preliminary Diagnostics for Healthcare Facilities. Key details:\n- Implemented RAG with FAISS vector database to enhance symptom retrieval over 1000+ files from both open source and the beneficiary.\n- Engineered LLM prompts to improve preliminary diagnostics."
    },
    {
        id: "projects_rag_ai",
        title: "RAG AI Knowledge Assistant and Other Chatbot Projects",
        content: "Projects:\n- RAG-Based AI Knowledge Assistant: Built a Retrieval-Augmented Generation chatbot using OpenAI embeddings and FAISS vector databases. Implemented document ingestion, chunking, semantic search, and context-aware response generation. Optimized retrieval accuracy across 10+ documents.\n- AI Solution Chatbot: Developed a conversational AI system for business inquiries. Designed workflow automation, state management, and system prompt architecture. Integrated Google Sheets for dynamic data retrieval.\n- Tomas Morato Dining Hub: Engineered a chatbot to answer inquiries related to local restaurants and cafes in Tomas Morato.\n- Ink and Solace Database Management System: Developed a relational database management system using PHP and custom database architecture to handle publishing industry records."
    },
    {
        id: "skills",
        title: "Skills and Expertise",
        content: "Skills & Expertise:\n- Core Skills: Technical Support, AI Solutions Development, System Integration & Automation, Quality Assurance & Testing.\n- Technical Skills: Software Development, AI and Data Engineering, Networking, IoT, and Hardware Engineering.\n- Tools & Technologies: Microsoft Office, Google Workspace (Docs, Sheets, Drive), Python, PHP, FAISS, OpenAI embeddings, APIs, HTML, CSS, JavaScript."
    },
    {
        id: "education",
        title: "Education and Certifications",
        content: "Education & Certifications:\n- Bachelor of Science in Computer Engineering, Polytechnic University of the Philippines (PUP) – Sta. Mesa (2022 – 2026), GWA: 1.59.\n- Relevant Coursework: Computer Networking, Software and Database Development, Cloud Computing.\n- Member of ACCESS (Association of Concerned Computer Engineering Students for Service).\n- CCNA 1: Introduction to Networks (Cisco Networking Academy, 2025)\n- CCNA 2: Switching, Routing, and Wireless Essentials (Cisco Networking Academy, 2025)\n- CCNA 3: Enterprise Networking, Security, and Automation (Cisco Networking Academy, 2025)"
    },
    {
        id: "contact",
        title: "Contact and Social Links",
        content: "Contact Details for Maricon Jane G. Laguting:\n- Email: lagutingmaricon@gmail.com\n- Phone: 09923033890\n- Location: Tatalon, Quezon City, Philippines\n- LinkedIn: https://www.linkedin.com/in/maricon-jane-g-laguting-8250522b7/\n- GitHub: https://github.com/Laguting"
    }
];

const apiKey = process.env.GEMINI_API_KEY;

async function embedText(text) {
    if (!apiKey) {
        // Generate a mock 768-dimension vector if no API key is set
        const mockVector = Array.from({ length: 768 }, () => Math.random() * 2 - 1);
        // Normalize the mock vector
        const magnitude = Math.sqrt(mockVector.reduce((sum, val) => sum + val * val, 0));
        return mockVector.map(val => val / magnitude);
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`;
    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            model: "models/text-embedding-004",
            content: { parts: [{ text }] }
        })
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Embedding API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.embedding.values;
}

async function main() {
    console.log("Starting embedding generation...");
    if (!apiKey) {
        console.warn("WARNING: GEMINI_API_KEY environment variable not found. Generating mock embeddings for local compilation. Re-run this script with the API key set to enable real semantic search.");
    }

    const dataWithEmbeddings = [];

    for (const chunk of chunks) {
        console.log(`Embedding chunk: ${chunk.id}...`);
        try {
            const embedding = await embedText(chunk.content);
            dataWithEmbeddings.push({
                ...chunk,
                embedding
            });
        } catch (err) {
            console.error(`Error embedding chunk ${chunk.id}:`, err.message);
            process.exit(1);
        }
    }

    const outputPath = path.join(__dirname, '../api/resume_data.json');
    const apiDir = path.dirname(outputPath);
    if (!fs.existsSync(apiDir)) {
        fs.mkdirSync(apiDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, JSON.stringify(dataWithEmbeddings, null, 2), 'utf-8');
    console.log(`Saved ${dataWithEmbeddings.length} chunks with embeddings to ${outputPath}`);
}

main();
