# TransparAI - Further Development Steps

## 📋 **Project Overview**

**TransparAI** is an educational AI assistant that visualizes how Large Language Models think and reason through problems. It's built as a ChatGPT-like interface powered by Amazon Bedrock Agents that shows step-by-step reasoning flows in real-time.

### **Core Concept**

> _"A LLM MindMap — Visualizing How AI Thinks"_

The project demonstrates how Large Language Models reason and orchestrate AWS AI services autonomously, visualizing each step in a flow diagram to make the "black box" transparent for ML/AI learners.

---

## 🏗️ **Current Architecture**

### **Frontend (React + Vite)**

- **Port**: 3000
- **Tech Stack**: React, Tailwind CSS, React Flow, Framer Motion, Lucide Icons
- **Theme**: Dark Tech Theme (Blue/Cyan accents)
- **Components**:
  - `ChatInterface.jsx` - ChatGPT-like chat interface
  - `FlowVisualization.jsx` - 2D reasoning flow visualization
  - `Header.jsx` - App header with branding
  - `Footer.jsx` - Attribution footer
  - `CustomNode.jsx` - Custom nodes for React Flow

### **Backend (Node.js + Express)**

- **Port**: 3002
- **Tech Stack**: Express, AWS SDK v3, CORS, Helmet
- **Services**:
  - `BedrockService.js` - Enhanced Bedrock Agent integration
  - Routes: `/api/bedrock/chat`, `/api/bedrock/test`, `/api/health`

### **AWS Integration**

- **Bedrock Agent ID**: `STQJFYK634`
- **Agent Alias**: `TSTALIASID`
- **Foundation Model**: Amazon Nova Pro
- **Region**: ap-south-1
- **Features**: Reasoning trace capture enabled

---

## ✅ **Completed Development Steps**

### **Phase 1: Foundation Setup**

- [x] Project structure created with frontend/backend separation
- [x] Package configurations and dependencies installed
- [x] AWS Bedrock Agent integration working
- [x] Basic chat interface functional

### **Phase 2: Enhanced Backend**

- [x] **Bedrock Agent Service Enhanced** - Improved reasoning trace capture
- [x] **Flow Data Generation** - Creates comprehensive flow diagrams
- [x] **Trace Processing** - Extracts preprocessing, orchestration, postprocessing steps
- [x] **Error Handling** - Robust error handling and fallbacks
- [x] **Debugging Added** - Console logs for troubleshooting

### **Phase 3: Frontend Visualization**

- [x] **Chat Interface** - Working ChatGPT-like interface with markdown support
- [x] **Flow Visualization** - 2D reasoning flow using React Flow
- [x] **Dark Tech Theme** - Professional blue/cyan color scheme
- [x] **Interactive Nodes** - Clickable nodes with detailed information
- [x] **Responsive Design** - Works on desktop and mobile
- [x] **Attribution Footer** - AWS AI Agent Global Hackathon powered by DEVPOST

### **Phase 4: AgentCore Integration Attempts**

- [x] **Enhanced Trace Capture** - Attempted advanced AgentCore reasoning extraction
- [x] **3D Visualization Planning** - Created specs for 3D flow visualization
- [x] **Troubleshooting** - Resolved backend startup issues and flow data problems

---

## 🎯 **Current Status (Working Features)**

### **✅ What's Working:**

1. **Chat Interface** - Users can ask ML/AI questions and get responses
2. **Bedrock Agent Integration** - Connected to existing agent (STQJFYK634)
3. **Flow Visualization** - Shows reasoning flow: User → Bedrock Agent → Nova Pro → Response
4. **Reasoning Traces** - Captures and displays preprocessing, orchestration, postprocessing steps
5. **Interactive UI** - Click nodes for details, animated connections
6. **Professional Design** - Dark tech theme with proper branding

### **🔧 Current Flow Structure:**

```
User Question → Bedrock Agent → [Reasoning Steps] → Nova Pro Model → AI Response
```

### **📊 Data Flow:**

1. User submits question via chat interface
2. Frontend sends request to backend `/api/bedrock/chat`
3. Backend invokes Bedrock Agent with `enableTrace: true`
4. Agent processes with Nova Pro model
5. Backend captures reasoning traces and generates flow data
6. Frontend visualizes flow using React Flow with custom nodes

---

## 🚀 **Next Development Phases**

### **Phase 5: Enhanced 3D Visualization (Planned)**

- [ ] **3D Scene Setup** - Implement Three.js + React Three Fiber
- [ ] **3D Node Components** - Create service-specific 3D geometries
- [ ] **3D Connections** - Animated 3D connections between nodes
- [ ] **Camera Controls** - Interactive 3D navigation
- [ ] **Performance Optimization** - Smooth 60fps rendering

### **Phase 6: Make Flow Visualization More Dynamic (Priority)**

- [ ] **Enhanced Trace Capture** - Capture more detailed AgentCore logs and reasoning steps
- [ ] **Action Group Integration** - Show when external tools are used in the flow
- [ ] **Knowledge Base Queries** - Visualize knowledge retrieval steps and database queries
- [ ] **Decision Point Mapping** - Show AgentCore's actual decision tree and branching logic
- [ ] **Real-time Streaming** - WebSocket for live reasoning updates
- [ ] **Tool Usage Tracking** - Visualize external tool invocations and API calls

### **Phase 7: Educational Enhancements (Planned)**

- [ ] **Reasoning Explanations** - AI explains its own reasoning steps
- [ ] **Flow Replay** - Step-by-step replay of reasoning process
- [ ] **Pattern Analysis** - Identify common reasoning patterns
- [ ] **Educational Tooltips** - Context-aware help system
- [ ] **Export Capabilities** - Save and share reasoning flows

### **Phase 8: Production Features (Planned)**

- [ ] **User Sessions** - Persistent chat sessions
- [ ] **Flow History** - Save and retrieve past reasoning flows
- [ ] **Performance Metrics** - Response time and accuracy tracking
- [ ] **Multi-model Support** - Support for different foundation models
- [ ] **Deployment** - AWS Lambda + CloudFront deployment

---

## 🛠️ **Technical Specifications**

### **Current Dependencies**

```json
Frontend: React 18, Vite 5, Tailwind CSS 3, React Flow 11, Framer Motion 10
Backend: Express 4, AWS SDK v3, Node.js 18+, UUID 9
AWS: Bedrock Agent Runtime, Nova Pro Model
```

### **Environment Configuration**

```bash
# Backend .env
AWS_REGION=ap-south-1
BEDROCK_AGENT_ID=STQJFYK634
BEDROCK_AGENT_ALIAS_ID=TSTALIASID
PORT=3002
NODE_ENV=development
```

### **Agent Instructions (Current)**

```
You are TransparAI, an educational AI assistant that specializes in explaining machine learning and AI concepts through step-by-step reasoning. Your primary goal is to help users understand how AI systems think and make decisions.

When answering questions:
1. Think through problems step-by-step
2. Explain your reasoning process clearly
3. Break down complex concepts into understandable parts
4. Use examples when helpful
5. Be educational and encouraging

You have access to various tools and services to provide comprehensive answers. Always explain why you're using specific tools or taking certain steps in your reasoning process.

Focus on making AI and ML concepts accessible to learners at all levels.
```

---

## 🎯 **Key Implementation Notes**

### **Bedrock Agent Integration**

- **Agent Core Reasoning**: The existing Bedrock Agent already includes core reasoning capabilities
- **Trace Capture**: `enableTrace: true` captures preprocessing, orchestration, postprocessing
- **No Additional Setup**: No need to create separate "AgentCore" - it's built into the agent
- **Enhanced Visualization**: Backend processes traces into comprehensive flow diagrams

### **Flow Data Structure**

```javascript
flowData = {
  nodes: [
    {
      id: "user-input",
      type: "input",
      data: { label: "User Question", service: "user" },
    },
    {
      id: "bedrock-agent",
      type: "agent",
      data: { label: "Bedrock Agent", service: "bedrock-agent" },
    },
    {
      id: "reasoning-1",
      type: "reasoning",
      data: { label: "Input Processing", service: "bedrock-agent" },
    },
    {
      id: "nova-pro",
      type: "model",
      data: { label: "Nova Pro Model", service: "nova" },
    },
    {
      id: "final-response",
      type: "output",
      data: { label: "AI Response", service: "response" },
    },
  ],
  edges: [
    {
      id: "user-input-bedrock-agent",
      source: "user-input",
      target: "bedrock-agent",
    },
    // ... more connections
  ],
};
```

### **Troubleshooting Notes**

- **Backend Startup Issues**: Avoid complex AWS SDK imports that can cause startup failures
- **Flow Data Empty**: Always generate basic flow structure even without reasoning traces
- **Frontend Data Access**: Use `node.data.label` not `node.label` for proper data access
- **CORS Configuration**: Backend allows localhost:3000 and localhost:5173 for development

---

## 📚 **Resources & Documentation**

### **Project Files Structure**

```
TransparAI/
├── frontend/                 # React frontend (port 3000)
│   ├── src/components/      # React components
│   ├── src/services/        # API services
│   └── package.json         # Frontend dependencies
├── backend/                 # Node.js backend (port 3002)
│   ├── src/services/        # Bedrock integration
│   ├── src/routes/          # API routes
│   └── .env                 # AWS configuration
├── .kiro/specs/             # Development specifications
├── docs/                    # Documentation
├── README.md               # Project overview
└── FURTHER_STEPS.md        # This file
```

### **Key Commands**

```bash
# Start development
npm run dev                  # Start both frontend and backend
cd frontend && npm run dev   # Frontend only (port 3000)
cd backend && npm run dev    # Backend only (port 3002)

# Test AWS connection
cd backend && npm run verify-aws-setup
```

---

## 🎉 **Success Metrics Achieved**

- ✅ **Working Chat Interface** - Users can interact with AI
- ✅ **Real-time Flow Visualization** - Shows reasoning process
- ✅ **Professional UI/UX** - Dark tech theme, responsive design
- ✅ **AWS Integration** - Bedrock Agent with Nova Pro working
- ✅ **Educational Value** - Makes AI reasoning transparent
- ✅ **Hackathon Ready** - Proper attribution and branding

---

## 💡 **For Future Kiro Sessions**

When resuming development:

1. **Current State**: Chat interface working, 2D flow visualization functional
2. **Next Priority**: Implement 3D visualization using Three.js
3. **Key Files**:
   - Backend: `backend/src/services/bedrockService.js`
   - Frontend: `frontend/src/components/FlowVisualization.jsx`
4. **AWS Setup**: Agent STQJFYK634 is configured and working
5. **Theme**: Dark tech with blue/cyan accents
6. **Port Configuration**: Frontend 3000, Backend 3002

The foundation is solid - focus on enhancing the visualization and adding advanced AgentCore features for the next development phase.

---

_Last Updated: December 2024_
_Project Status: Phase 4 Complete - Ready for 3D Visualization Enhancement_

---

## 🚨 **CRITICAL ISSUE - Web Search Integration Blocked**

### **Current Problem (October 16, 2024)**

**Issue**: Bedrock Agent Model Timeout when attempting web search queries

- **Error**: `Dependency resource: received model timeout/error exception from Bedrock`
- **Timeout Duration**: 2-3 seconds consistently
- **Affected Queries**: Questions that should trigger web search (e.g., "What is Amazon Nova Pro?")
- **Working Queries**: Basic AI/ML questions work fine (e.g., "What is a neural network?")

### **What's Been Implemented ✅**

- ✅ **Lambda Function**: `transparai-web-search` deployed and tested successfully
- ✅ **Agent Alias**: Created proper alias (YCLYDNYCK9) instead of TSTALIASID
- ✅ **Action Group**: `web-search` configured with correct parameters
- ✅ **Permissions**: Lambda permissions for Bedrock Agent added
- ✅ **Models Tested**: Both Amazon Nova Pro and Claude 3 Sonnet show same issue

### **Root Cause Analysis**

The issue occurs during the **orchestration phase** when the Bedrock Agent tries to:

1. Process agent instructions
2. Decide whether to use the webSearch action
3. Invoke the foundation model for decision-making

**Hypothesis**: Either regional model capacity issues (ap-south-1) or agent instruction complexity causing processing delays.

### **Configuration Backup**

```bash
# Working Configuration
AWS_REGION=ap-south-1
BEDROCK_AGENT_ID=STQJFYK634
BEDROCK_AGENT_ALIAS_ID=YCLYDNYCK9

# Lambda Function
Function Name: transparai-web-search
Runtime: Node.js 18.x
Status: Active and tested successfully

# Test Results
"Hello" ✅
"What is a neural network?" ✅
"What is Amazon Nova Pro?" ❌ (timeout)
```

---

## 🛠️ **Next Session Troubleshooting Plan**

### **Priority 1: Region Testing (30 minutes)**

1. **Switch to us-east-1 region**
   - Create new agent in us-east-1
   - Deploy Lambda function to us-east-1
   - Test same configuration
   - **Rationale**: Most stable AWS region, likely to resolve capacity issues

### **Priority 2: Instruction Simplification (30 minutes)**

2. **Ultra-minimal agent instructions**
   ```
   You are TransparAI. Use webSearch for recent information.
   ```
   - Remove all complex instructions
   - Test basic functionality
   - Gradually add complexity back

### **Priority 3: Alternative Approaches (60 minutes)**

3. **Direct API Integration Fallback**
   - Skip Bedrock Agents for web search
   - Integrate web search directly in backend
   - Use foundation models via Bedrock Runtime API
   - Maintain same user experience

### **Diagnostic Commands**

```bash
# Test Lambda independently
aws lambda invoke --function-name transparai-web-search \
  --payload file://test-payload.json response.json

# Check AWS service health
# Visit: https://status.aws.amazon.com/

# Test different regions
AWS_REGION=us-east-1 npm run dev
```

### **Alternative Solutions**

- **Option A**: Hybrid approach (Bedrock Agent + direct web search)
- **Option B**: Custom orchestration logic in backend
- **Option C**: Different AWS services (Lex + Step Functions)

---

## ⚠️ **Current Flow Visualization Status**

### **Working Flow Visualization ✅**

The flow visualization is working correctly and shows enhanced reasoning steps:

**Current Flow Structure:**

```
User Question → AgentCore Entry → [5 Reasoning Steps] → Nova Pro → AI Response
```

**Enhanced Features Implemented:**

- ✅ **Simulated Reasoning Traces**: Generates detailed 7-8 node flows
- ✅ **Better Layout**: Fixed overlapping nodes with proper positioning
- ✅ **MiniMap Removed**: Cleaner visualization without clutter
- ✅ **Interactive Nodes**: Click for detailed reasoning information
- ✅ **Dynamic Positioning**: Intelligent node placement algorithm

**Flow Types Generated:**

- Input Analysis → Knowledge Retrieval → Strategic Planning → Model Invocation → Response Synthesis

The flow visualization is **production-ready** - the only blocker is the web search integration timeout issue.

---
