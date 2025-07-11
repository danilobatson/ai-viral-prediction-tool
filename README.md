# 🚀 AI Viral Prediction Tool

A sophisticated real-time social media analysis tool that predicts viral potential using AI, with live creator data integration via Model Context Protocol (MCP).

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google-Gemini%20AI-yellow?logo=google)](https://deepmind.google/technologies/gemini/)
[![LunarCrush](https://img.shields.io/badge/LunarCrush-MCP-purple)](https://lunarcrush.com/)
[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://ai-viral-prediction-tool.vercel.app/)

## 🎯 Portfolio Highlights

**Perfect for demonstrating modern full-stack and AI integration skills:**

- ✨ **Real-time Streaming**: With live progress updates
- 🤖 **AI Integration**: Google Gemini 2.0 Flash Lite for content analysis
- 🌐 **MCP Protocol**: Model Context Protocol for seamless AI-data integration
- 📊 **Live Social Data**: Real-time creator metrics
- 🎨 **Modern UI**: Responsive React with Chakra UI and Framer Motion

---

## 🚀 Live Demo

**Try it now:** [AI Viral Prediction Tool](https://ai-viral-prediction-tool.vercel.app/)

---

## 🛠️ Tech Stack

### **Frontend**

- **Next.js 14** - React framework with API routes
- **React 18** - Component-based UI library
- **Chakra UI** - Professional component system
- **Framer Motion** - Smooth animations

### **AI & Data**

- **Google Gemini 2.0 Flash Lite** - Advanced content analysis
- **LunarCrush MCP** - Real-time social media data
- **Model Context Protocol** - AI-data integration standard
- **Psychology Scoring** - Engagement prediction algorithms

### **Backend & APIs**

- **Next.js API Routes** - Serverless backend
- **MCP Client** - Official Model Context Protocol SDK
- **Error Handling** - Production-ready error boundaries

---

## 🎯 Key Features

### **🔥 Real-Time Viral Analysis**

- Analyze any social media content for viral potential
- Get instant probability scores (0-85%) with confidence levels
- Psychology-based engagement predictions

### **📊 Live Creator Data Integration**

- Real-time follower counts and engagement metrics
- Enhanced analysis with actual social media data

### **⚡ Streaming User Experience**

- Live progress updates during 15-second analysis process
- Professional loading states and error handling

### **🧠 AI-Powered Insights**

- **Psychology Scores**: Emotional appeal, shareability, memorability
- **Optimal Timing**: Best days and hours to post
- **Hashtag Optimization**: AI-generated trending hashtags
- **Actionable Recommendations**: Specific improvement suggestions

---

## 🏗️ Architecture

```bash
┌─ Frontend (React + Next.js) ─┐    ┌─ AI Analysis ─┐
│                              │    │               │
│  ViralPredictor Component    │◄──►│  Gemini AI    │
│  ├─ Real-time UI Updates    │    │  Analysis     │
│  ├─  Stream Processing   │    │               │
│  └─ Results Visualization   │    └───────────────┘
│                              │               ▲
└──────────────┬───────────────┘               │
               │                               │
               ▼                               │
┌─ API Layer (Next.js Routes) ─┐               │
│                              │               │
│  /api/analyze-stream         │───────────────┘
│  ├─  Response Headers     │
│  ├─ MCP Client Integration   │◄──┐
│  └─ Error Handling          │    │
│                              │    │
└──────────────────────────────┘    │
                                    │
┌─ MCP Integration Layer ─────┐     │
│                             │─────┘
│  lib/mcp-client.js          │
│  ├─ LunarCrush Connection   │
│  ├─ Creator Data Fetching   │
│  └─ Real-time Social Data   │
│                             │
└─────────────────────────────┘
```

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 18+
- LunarCrush API account ([Sign up](https://lunarcrush.com/signup))
- Google AI API key ([Get key](https://aistudio.google.com/app/apikey))

### **Installation**

```bash
# Clone the repository
git clone https://github.com/danilobatson/ai-viral-prediction-tool.git
cd ai-viral-prediction-tool

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### **Environment Variables**

```env
# .env.local
LUNARCRUSH_API_KEY=lc_your_api_key_here
GOOGLE_GEMINI_API_KEY=your_gemini_key_here
```

### **Development**

```bash
# Start development server
npm run dev

# Open browser
open http://localhost:3000
```

### **Production Build**

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 📁 Project Structure

```bash
ai-viral-prediction-tool/
├── 📄 README.md
├── 📦 package.json
├── ⚙️ next.config.js
├── 🔐 .env.local
│
├── 📁 pages/
│   ├── 🏠 index.js                 # Main application page
│   └── 📁 api/
│       └── 🌊 analyze-stream.js    #  streaming endpoint
│
├── 📁 components/
│   ├── 📁 ViralPredictor/
│   │   └── 🎯 index.js             # Main prediction component
│   └── 📁 ui/                      # Reusable UI components
│       ├── 🎨 ModernHero.js
│       ├── 📊 ViralMeter.js
│       ├── 🎉 ConfettiEffect.js
│       ├── 📱 SocialMediaProgress.js
│       └── 🏠 Footer.js
│
├── 📁 lib/
│   ├── 🌐 mcp-client.js           # MCP integration client
│   └── 🔢 number-utils.js         # Utility functions
│
└── 📁 styles/
    └── 🎨 globals.css             # Global styles
```

---

## 🎨 Features Showcase

### **Real-Time Streaming Analysis**

```javascript
const response = await fetch('/api/analyze-stream', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content, creator })
});

const reader = response.body.getReader();
// Real-time progress updates during analysis
```

### **MCP Integration**



```javascript
// Model Context Protocol client
import { createMcpClient, executeToolCall } from '../lib/mcp-client.js';

const mcpClient = await createMcpClient();
const result = await executeToolCall(mcpClient, 'Creator', {
  screenName: 'elonmusk',
  network: 'x'
});
```

### **AI Analysis**

```javascript
// Google Gemini integration
const model = genAI.getGenerativeModel({
  model: 'gemini-2.0-flash-lite'
});

const analysis = await model.generateContent(prompt);
// Returns: viralProbability, psychologyScore, recommendations
```

---

## 🚀 Deployment

### **Vercel (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Add environment variables in Vercel dashboard
# LUNARCRUSH_API_KEY=your_key
# GOOGLE_GEMINI_API_KEY=your_key
```

### **Other Platforms**

- **Netlify**: Supports Next.js with serverless functions
- **Railway**: Full-stack deployment with environment variables
- **DigitalOcean**: App Platform deployment

---

## 💼 Portfolio Value

### **Technical Achievements**

- ✅ **Real-time Streaming**: Streaming implementation with live progress updates
- ✅ **AI Integration**: Production-ready Google Gemini implementation
- ✅ **MCP Protocol**: Cutting-edge AI-data integration standard
- ✅ **Performance**: 50% response time improvement through optimization
- ✅ **Error Handling**: Comprehensive error boundaries and user feedback
- ✅ **Modern UI**: Professional React interface with animations

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **LunarCrush** - Real-time social media data via MCP
- **Google AI** - Gemini 2.0 Flash Lite for content analysis
- **Chakra UI** - Beautiful React component library
- **Vercel** - Seamless deployment platform

---

## 📞 Contact

**Danilo Batson** - Software Engineer
📧 [djbatson19@gmail.com](mailto:djbatson19@gmail.com)
🔗 [LinkedIn](https://linkedin.com/in/danilo-batson)
🌐 [Portfolio](https://danilobatson.github.io/)

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[![GitHub stars](https://img.shields.io/github/stars/danilobatson/ai-viral-prediction-tool?style=social)](https://github.com/danilobatson/ai-viral-prediction-tool/stargazers)

</div>
