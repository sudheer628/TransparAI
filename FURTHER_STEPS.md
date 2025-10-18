# TransparAI - SageMaker AI Implementation Plan

## 📋 **Project Overview**

**TransparAI** is an educational AI assistant that visualizes how Large Language Models think and reason through problems. It's built as a ChatGPT-like interface powered by **Amazon SageMaker AI Agents** that shows step-by-step reasoning flows in real-time.

### **Core Concept**

> _"A LLM MindMap — Visualizing How AI Thinks"_

The project demonstrates how Large Language Models reason and orchestrate AWS AI services autonomously, visualizing each step in a flow diagram to make the "black box" transparent for ML/AI learners.

---

## 🏗️ **NEW Architecture (SageMaker AI)**

### **Frontend (React + Vite) - UNCHANGED**

- **Port**: 3000
- **Tech Stack**: React, Tailwind CSS, React Flow, Framer Motion, Lucide Icons
- **Theme**: Dark Tech Theme (Blue/Cyan accents)
- **Components**:
  - `ChatInterface.jsx` - ChatGPT-like chat interface
  - `FlowVisualization.jsx` - 2D reasoning flow visualization
  - `Header.jsx` - App header with branding
  - `Footer.jsx` - Attribution footer
  - `CustomNode.jsx` - Custom nodes for React Flow

### **Backend (Node.js + Express) - UPDATED**

- **Port**: 3002
- **Tech Stack**: Express, AWS SDK v3, CORS, Helmet
- **Services**:
  - `SageMakerService.js` - NEW SageMaker AI Agent integration
  - Routes: `/api/sagemaker/chat`, `/api/sagemaker/test`, `/api/health`

### **AWS Integration - NEW APPROACH**

- **Service**: Amazon SageMaker AI Agents
- **Region**: us-east-1 (Primary AWS region - most stable)
- **Foundation Model**: Claude 3.5 Sonnet or Nova Pro via SageMaker
- **Web Search**: Direct integration with Serper API
- **Features**: Advanced reasoning trace capture, tool orchestration

---

## ✅ **Completed Development Steps (Previous Bedrock Approach)**

### **Phase 1: Foundation Setup**

- [x] Project structure created with frontend/backend separation
- [x] Package configurations and dependencies installed
- [x] Frontend chat interface and flow visualization working
- [x] Basic AWS integration established

### **Phase 2: Frontend Excellence**

- [x] **Chat Interface** - Working ChatGPT-like interface with markdown support
- [x] **Flow Visualization** - 2D reasoning flow using React Flow
- [x] **Dark Tech Theme** - Professional blue/cyan color scheme
- [x] **Interactive Nodes** - Clickable nodes with detailed information
- [x] **Responsive Design** - Works on desktop and mobile
- [x] **Attribution Footer** - AWS AI Agent Global Hackathon powered by DEVPOST

### **Phase 3: Architecture Decision**

- [x] **Bedrock Agent Issues Identified** - Permission and inference profile problems
- [x] **SageMaker AI Research** - Identified as superior alternative
- [x] **Region Strategy** - us-east-1 selected for stability
- [x] **Implementation Plan** - Complete SageMaker AI migration strategy

---

## 🎯 **NEW Implementation Plan - SageMaker AI**

### **✅ What's Already Working (Frontend):**

1. **Chat Interface** - Users can ask ML/AI questions and get responses
2. **Flow Visualization** - Shows reasoning flow with interactive nodes
3. **Professional UI** - Dark tech theme, responsive design
4. **React Flow Integration** - Custom nodes, animated connections
5. **Frontend Architecture** - Complete and ready for new backend

### **🔧 NEW Flow Structure (SageMaker AI):**

```
User Question → SageMaker AI Agent → [Tool Orchestration] → Web Search + LLM → AI Response
```

### **📊 NEW Data Flow:**

1. User submits question via chat interface (unchanged)
2. Frontend sends request to backend `/api/sagemaker/chat` (new endpoint)
3. Backend creates SageMaker AI Agent session
4. Agent decides if web search is needed using built-in reasoning
5. Agent calls Serper API directly (no Lambda needed)
6. Agent processes with foundation model (Claude/Nova)
7. Backend captures detailed reasoning traces
8. Frontend visualizes enhanced flow using existing React Flow components

---

## 🚀 **SageMaker AI Implementation Phases**

### **Phase 4: SageMaker AI Backend Setup (IMMEDIATE - 2-3 hours)**

- [ ] **SageMaker AI Service Setup** - Create SageMaker AI Agent in us-east-1
- [ ] **Backend Service Migration** - Replace BedrockService with SageMakerService
- [ ] **Direct Web Search Integration** - Integrate Serper API directly in agent tools
- [ ] **Foundation Model Configuration** - Set up Claude 3.5 Sonnet or Nova Pro
- [ ] **Reasoning Trace Capture** - Implement SageMaker AI trace extraction
- [ ] **API Route Updates** - Update backend routes for SageMaker integration

### **Phase 5: Enhanced Agent Capabilities (PRIORITY - 3-4 hours)**

- [ ] **Tool Orchestration** - Configure SageMaker AI agent with web search tools
- [ ] **Decision Logic** - Implement intelligent web search triggering
- [ ] **Multi-step Reasoning** - Capture complex reasoning chains
- [ ] **Error Handling** - Robust error handling for agent failures
- [ ] **Performance Optimization** - Optimize response times and reliability

### **Phase 6: Advanced Flow Visualization (ENHANCEMENT - 2-3 hours)**

- [ ] **Enhanced Trace Processing** - Process SageMaker AI detailed traces
- [ ] **Tool Usage Visualization** - Show when web search tools are invoked
- [ ] **Decision Point Mapping** - Visualize agent decision-making process
- [ ] **Real-time Updates** - Stream reasoning steps as they happen
- [ ] **Interactive Tool Details** - Click nodes to see tool parameters and results

### **Phase 7: Production Ready Features (FINAL - 2-3 hours)**

- [ ] **Environment Configuration** - Production-ready environment setup
- [ ] **Error Recovery** - Graceful fallbacks for agent failures
- [ ] **Performance Monitoring** - Track agent performance and costs
- [ ] **Documentation** - Complete API documentation and deployment guide
- [ ] **Testing Suite** - Comprehensive testing for all agent scenarios

---

## 🛠️ **NEW Technical Specifications**

### **Dependencies (Updated)**

```json
Frontend: React 18, Vite 5, Tailwind CSS 3, React Flow 11, Framer Motion 10 (UNCHANGED)
Backend: Express 4, AWS SDK v3, Node.js 18+, UUID 9, Axios (for Serper API)
AWS: SageMaker AI Agents, Claude 3.5 Sonnet/Nova Pro, us-east-1 region
```

### **NEW Environment Configuration**

```bash
# Backend .env (UPDATED)
AWS_REGION=us-east-1
SAGEMAKER_AGENT_ID=<to-be-created>
SAGEMAKER_AGENT_ALIAS_ID=<to-be-created>
SERPER_API_KEY=<your-serper-key>
PORT=3002
NODE_ENV=development
```

### **SageMaker AI Agent Instructions (NEW)**

```
You are TransparAI, an educational AI assistant that specializes in explaining machine learning and AI concepts through step-by-step reasoning.

CORE CAPABILITIES:
- Explain AI/ML concepts clearly and educationally
- Use web search for current information about recent AI developments
- Show your reasoning process step-by-step
- Make complex concepts accessible to learners

TOOLS AVAILABLE:
- webSearch: Use for recent AI news, product launches, current information
- reasoning: Always explain your thought process

WHEN TO USE WEB SEARCH:
- Questions about recent AI products (e.g., "What is Amazon Nova Pro?")
- Current AI industry news and developments
- Latest research papers or breakthroughs
- Company announcements and product updates

RESPONSE FORMAT:
1. Acknowledge the question
2. Explain if you need to search for current information
3. Provide comprehensive, educational answers
4. Break down complex concepts into understandable parts
```

---

## 🎯 **SageMaker AI Implementation Guide**

### **Step 1: SageMaker AI Agent Setup (us-east-1)**

```bash
# 1. Create SageMaker AI Agent
aws sagemaker create-agent \
  --agent-name "TransparAI-Agent" \
  --foundation-model "anthropic.claude-3-5-sonnet-20241022-v2:0" \
  --instruction "file://agent-instructions.txt" \
  --region us-east-1

# 2. Create Agent Action Group for Web Search
aws sagemaker create-agent-action-group \
  --agent-id <agent-id> \
  --action-group-name "web-search" \
  --description "Search the web for current information" \
  --region us-east-1
```

### **Step 2: Backend Service Migration**

```javascript
// NEW: backend/src/services/sageMakerService.js
class SageMakerService {
  constructor() {
    this.sagemakerClient = new SageMakerAgentRuntimeClient({
      region: "us-east-1",
    });
    this.serperApiKey = process.env.SERPER_API_KEY;
  }

  async invokeAgent(message) {
    // Direct SageMaker AI Agent invocation
    // Built-in tool orchestration
    // Enhanced trace capture
  }

  async webSearch(query) {
    // Direct Serper API integration
    // No Lambda function needed
  }
}
```

### **Step 3: Enhanced Flow Data Structure**

```javascript
// Enhanced flow with SageMaker AI capabilities
flowData = {
  nodes: [
    {
      id: "user-input",
      type: "input",
      data: { label: "User Question", service: "user" },
    },
    {
      id: "sagemaker-agent",
      type: "agent",
      data: { label: "SageMaker AI Agent", service: "sagemaker" },
    },
    {
      id: "decision-point",
      type: "decision",
      data: { label: "Web Search Decision", service: "sagemaker" },
    },
    {
      id: "web-search",
      type: "tool",
      data: { label: "Serper Web Search", service: "serper" },
    },
    {
      id: "claude-model",
      type: "model",
      data: { label: "Claude 3.5 Sonnet", service: "claude" },
    },
    {
      id: "final-response",
      type: "output",
      data: { label: "AI Response", service: "response" },
    },
  ],
  edges: [
    // Dynamic edges based on agent decisions
  ],
};
```

### **Key Advantages of SageMaker AI**

- ✅ **No Permission Issues** - SageMaker AI has mature IAM integration
- ✅ **Better Tool Orchestration** - Built-in tool management and decision-making
- ✅ **Enhanced Tracing** - More detailed reasoning traces than Bedrock Agents
- ✅ **Direct API Integration** - No Lambda functions needed for tools
- ✅ **Stable Region** - us-east-1 is AWS's most stable region
- ✅ **Cost Effective** - More predictable pricing than Bedrock Agents

---

## 📚 **Implementation Resources**

### **Project Files Structure (Updated)**

```
TransparAI/
├── frontend/                 # React frontend (port 3000) - UNCHANGED
│   ├── src/components/      # React components (working)
│   ├── src/services/        # API services (update endpoints)
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend (port 3002) - UPDATED
│   ├── src/services/        # NEW: SageMaker AI integration
│   │   ├── sageMakerService.js  # NEW: SageMaker AI Agent service
│   │   └── serperService.js     # NEW: Direct Serper API integration
│   ├── src/routes/          # Updated API routes
│   │   └── sagemaker.js     # NEW: SageMaker AI routes
│   └── .env                 # Updated AWS configuration
├── .kiro/specs/             # Development specifications
├── docs/                    # Documentation
├── README.md               # Project overview
└── FURTHER_STEPS.md        # This file
```

### **Implementation Commands**

```bash
# Phase 4: SageMaker AI Setup
cd backend
npm install @aws-sdk/client-sagemaker-agent-runtime axios
npm install @aws-sdk/client-sagemaker

# Update environment
echo "AWS_REGION=us-east-1" >> .env
echo "SERPER_API_KEY=your-key-here" >> .env

# Start development
npm run dev                  # Start both frontend and backend
cd frontend && npm run dev   # Frontend only (port 3000)
cd backend && npm run dev    # Backend only (port 3002)

# Test SageMaker AI connection
cd backend && npm run verify-sagemaker-setup
```

### **AWS CLI Commands for Setup**

```bash
# Switch to us-east-1 region
export AWS_DEFAULT_REGION=us-east-1

# Create SageMaker AI Agent
aws sagemaker create-agent \
  --agent-name "TransparAI-Agent" \
  --foundation-model "anthropic.claude-3-5-sonnet-20241022-v2:0" \
  --instruction "You are TransparAI, an educational AI assistant..." \
  --region us-east-1

# List available foundation models in us-east-1
aws bedrock list-foundation-models --region us-east-1
```

---

## 🎉 **Success Metrics Target (SageMaker AI)**

### **Phase 4 Goals (IMMEDIATE)**

- ✅ **Frontend Ready** - Chat interface and flow visualization working
- [ ] **SageMaker AI Agent** - Create and configure in us-east-1
- [ ] **Web Search Integration** - Direct Serper API integration working
- [ ] **Backend Migration** - SageMaker AI service replacing Bedrock
- [ ] **Enhanced Tracing** - Detailed reasoning flow capture

### **Phase 5 Goals (PRIORITY)**

- [ ] **Tool Orchestration** - Intelligent web search decision-making
- [ ] **Multi-step Reasoning** - Complex reasoning chains visualized
- [ ] **Error Handling** - Robust fallbacks and error recovery
- [ ] **Performance Optimization** - Fast response times (<3 seconds)

### **Hackathon Compliance ✅**

- ✅ **AWS AI Service** - SageMaker AI Agents (meets requirement)
- ✅ **Educational Value** - Makes AI reasoning transparent
- ✅ **Professional UI/UX** - Dark tech theme, responsive design
- ✅ **Proper Attribution** - AWS AI Agent Global Hackathon branding

---

## 💡 **Next Development Session Plan**

### **Immediate Actions (Phase 4 - 2-3 hours)**

1. **SageMaker AI Setup** (45 minutes)

   - Create SageMaker AI Agent in us-east-1
   - Configure Claude 3.5 Sonnet or Nova Pro
   - Set up agent instructions and capabilities

2. **Backend Migration** (60 minutes)

   - Create `sageMakerService.js`
   - Implement direct Serper API integration
   - Update API routes and error handling

3. **Integration Testing** (30 minutes)

   - Test basic chat functionality
   - Verify web search triggers correctly
   - Ensure flow visualization works

4. **Enhanced Features** (45 minutes)
   - Implement detailed trace capture
   - Add tool usage visualization
   - Optimize response performance

### **Key Files to Create/Update**

```bash
# NEW FILES
backend/src/services/sageMakerService.js
backend/src/services/serperService.js
backend/src/routes/sagemaker.js

# UPDATE FILES
backend/.env (region and keys)
frontend/src/services/api.js (endpoint updates)
```

### **Success Criteria**

- [ ] User can ask "What is Amazon Nova Pro?" and get web search results
- [ ] Flow visualization shows: User → SageMaker Agent → Web Search → LLM → Response
- [ ] Response time under 5 seconds for web search queries
- [ ] Detailed reasoning traces captured and visualized

---

_Last Updated: October 18, 2024_
_Project Status: Ready for SageMaker AI Migration - Phase 4 Implementation_
_Next Session: SageMaker AI Agent Setup and Backend Migration_

---

## 🚀 **Why SageMaker AI is the Right Choice**

### **Advantages Over Bedrock Agents**

- ✅ **Mature Service** - SageMaker AI has been stable for years
- ✅ **Better Documentation** - Comprehensive guides and examples
- ✅ **No Permission Issues** - Well-established IAM patterns
- ✅ **Enhanced Tracing** - More detailed reasoning capture
- ✅ **Tool Integration** - Native support for external API calls
- ✅ **Cost Predictability** - Transparent pricing model
- ✅ **Regional Stability** - us-east-1 is AWS's most reliable region

### **Hackathon Requirements Met**

- ✅ **Amazon SageMaker AI** - Primary AWS AI service used
- ✅ **Agent Architecture** - AI agent with tool orchestration
- ✅ **Educational Value** - Visualizes AI reasoning process
- ✅ **AWS Integration** - Native AWS service integration
- ✅ **Innovation** - Novel approach to AI transparency

The SageMaker AI approach provides a more reliable foundation for the hackathon submission while maintaining all the educational and visualization features that make TransparAI unique.

---
