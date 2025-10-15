# 3D Flow Visualization Design Document

## Overview

This design outlines the implementation of a real-time 3D visualization system that shows how Amazon Bedrock AgentCore processes user queries through various AWS services. The system will capture reasoning traces, store them in DynamoDB, and render them as an interactive 3D flow diagram.

## Architecture

### High-Level Architecture

```
Frontend (React + Three.js)
    ↓
API Gateway
    ↓
Lambda Functions
    ↓
Amazon Bedrock AgentCore ← → DynamoDB (Reasoning Traces)
    ↓
Amazon Nova Pro Model
```

### Component Architecture

1. **Frontend 3D Visualization Engine**

   - Three.js for 3D rendering
   - React Three Fiber for React integration
   - Real-time WebSocket connection for live updates

2. **Backend Processing Pipeline**

   - Enhanced Bedrock Service with trace capture
   - DynamoDB for storing reasoning traces
   - WebSocket API for real-time updates

3. **AWS Services Integration**
   - Bedrock AgentCore with reasoning traces enabled
   - Lambda for processing and routing
   - DynamoDB for trace storage
   - API Gateway for WebSocket connections

## Components and Interfaces

### 1. Enhanced Bedrock Service

```javascript
class EnhancedBedrockService {
  async invokeAgentWithTracing(inputText, sessionId) {
    // Enable detailed tracing
    const command = new InvokeAgentCommand({
      agentId: this.agentId,
      agentAliasId: this.agentAliasId,
      sessionId: sessionId,
      inputText: inputText,
      enableTrace: true,
      traceLevel: "DETAILED", // Capture all reasoning steps
    });

    // Process streaming response with trace capture
    const result = await this.processStreamingResponseWithTraces(response);

    // Store traces in DynamoDB
    await this.storeReasoningTraces(sessionId, result.traces);

    // Send real-time updates via WebSocket
    await this.broadcastTraceUpdates(sessionId, result.traces);

    return result;
  }
}
```

### 2. 3D Visualization Component

```javascript
// React Three Fiber component for 3D visualization
const FlowVisualization3D = ({ sessionId }) => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [animationQueue, setAnimationQueue] = useState([]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    const ws = new WebSocket(`wss://api.transparai.com/ws/${sessionId}`);

    ws.onmessage = (event) => {
      const traceData = JSON.parse(event.data);
      updateVisualization(traceData);
    };
  }, [sessionId]);

  return (
    <Canvas>
      <Scene3D nodes={nodes} connections={connections} />
    </Canvas>
  );
};
```

### 3. DynamoDB Schema

```javascript
// Reasoning Traces Table
const ReasoningTracesTable = {
  TableName: "TransparAI-ReasoningTraces",
  KeySchema: [
    { AttributeName: "sessionId", KeyType: "HASH" },
    { AttributeName: "timestamp", KeyType: "RANGE" },
  ],
  AttributeDefinitions: [
    { AttributeName: "sessionId", AttributeType: "S" },
    { AttributeName: "timestamp", AttributeType: "N" },
    { AttributeName: "traceType", AttributeType: "S" },
    { AttributeName: "serviceInvoked", AttributeType: "S" },
  ],
  GlobalSecondaryIndexes: [
    {
      IndexName: "TraceTypeIndex",
      KeySchema: [
        { AttributeName: "traceType", KeyType: "HASH" },
        { AttributeName: "timestamp", KeyType: "RANGE" },
      ],
    },
  ],
};
```

## Data Models

### 1. Reasoning Trace Model

```javascript
const ReasoningTrace = {
  sessionId: "string", // Unique session identifier
  timestamp: "number", // Unix timestamp
  traceId: "string", // Unique trace identifier
  traceType: "string", // 'preprocessing' | 'orchestration' | 'postprocessing' | 'tool_use'
  serviceInvoked: "string", // AWS service name
  inputData: "object", // Input to the service
  outputData: "object", // Output from the service
  duration: "number", // Processing time in ms
  reasoning: "string", // AI reasoning explanation
  confidence: "number", // Confidence score 0-1
  position3D: {
    // 3D coordinates for visualization
    x: "number",
    y: "number",
    z: "number",
  },
  connections: ["string"], // Array of connected trace IDs
};
```

### 2. 3D Node Model

```javascript
const Node3D = {
  id: "string",
  type: "string", // 'service' | 'reasoning' | 'data' | 'decision'
  label: "string",
  service: "string", // AWS service name
  position: { x: "number", y: "number", z: "number" },
  status: "string", // 'waiting' | 'processing' | 'completed' | 'error'
  metadata: {
    duration: "number",
    confidence: "number",
    reasoning: "string",
    inputSize: "number",
    outputSize: "number",
  },
  visual: {
    color: "string",
    size: "number",
    animation: "string",
  },
};
```

### 3. Connection Model

```javascript
const Connection3D = {
  id: "string",
  source: "string", // Source node ID
  target: "string", // Target node ID
  type: "string", // 'data_flow' | 'reasoning_chain' | 'service_call'
  dataType: "string", // 'text' | 'embeddings' | 'api_call' | 'response'
  animated: "boolean",
  strength: "number", // Connection strength 0-1
  latency: "number", // Connection latency in ms
  visual: {
    color: "string",
    thickness: "number",
    animation: "string",
  },
};
```

## Error Handling

### 1. Bedrock Agent Failures

- Graceful degradation to 2D visualization
- Error nodes in 3D space showing failure points
- Retry mechanisms with exponential backoff

### 2. WebSocket Connection Issues

- Automatic reconnection with backoff
- Fallback to HTTP polling
- Local state preservation during disconnections

### 3. 3D Rendering Failures

- WebGL capability detection
- Fallback to 2D canvas rendering
- Performance monitoring and adaptive quality

## Testing Strategy

### 1. Unit Tests

- Bedrock service trace capture
- DynamoDB operations
- 3D coordinate calculations
- WebSocket message handling

### 2. Integration Tests

- End-to-end flow from query to 3D visualization
- Real-time update propagation
- Multi-session isolation
- Performance under load

### 3. Visual Tests

- 3D scene rendering accuracy
- Animation smoothness
- Interactive element responsiveness
- Cross-browser compatibility

## Implementation Phases

### Phase 1: Enhanced Backend Infrastructure

1. Upgrade Bedrock service with detailed tracing
2. Set up DynamoDB tables for trace storage
3. Implement WebSocket API for real-time updates
4. Create Lambda functions for trace processing

### Phase 2: 3D Visualization Engine

1. Integrate Three.js and React Three Fiber
2. Create 3D node and connection components
3. Implement camera controls and interactions
4. Add animation system for data flow

### Phase 3: Real-time Integration

1. Connect WebSocket to 3D visualization
2. Implement trace-to-3D mapping logic
3. Add real-time animation triggers
4. Optimize performance for smooth rendering

### Phase 4: Advanced Features

1. Add educational tooltips and explanations
2. Implement flow replay functionality
3. Create reasoning pattern analysis
4. Add export and sharing capabilities

## AWS Services Configuration

### 1. Bedrock AgentCore Setup

```bash
# Enable detailed tracing
aws bedrock-agent update-agent \
  --agent-id $BEDROCK_AGENT_ID \
  --agent-configuration '{
    "enableTrace": true,
    "traceLevel": "DETAILED",
    "reasoningConfiguration": {
      "captureIntermediateSteps": true,
      "explainDecisions": true
    }
  }'
```

### 2. DynamoDB Configuration

```bash
# Create reasoning traces table
aws dynamodb create-table \
  --table-name TransparAI-ReasoningTraces \
  --attribute-definitions \
    AttributeName=sessionId,AttributeType=S \
    AttributeName=timestamp,AttributeType=N \
  --key-schema \
    AttributeName=sessionId,KeyType=HASH \
    AttributeName=timestamp,KeyType=RANGE \
  --billing-mode PAY_PER_REQUEST
```

### 3. API Gateway WebSocket Setup

```bash
# Create WebSocket API
aws apigatewayv2 create-api \
  --name TransparAI-WebSocket \
  --protocol-type WEBSOCKET \
  --route-selection-expression '$request.body.action'
```

## Performance Considerations

### 1. 3D Rendering Optimization

- Level-of-detail (LOD) system for complex scenes
- Frustum culling for off-screen objects
- Instanced rendering for similar nodes
- Adaptive quality based on device capabilities

### 2. Real-time Data Handling

- Message batching for high-frequency updates
- Delta compression for trace data
- Client-side prediction for smooth animations
- Graceful degradation under high load

### 3. Memory Management

- Object pooling for 3D components
- Automatic cleanup of old traces
- Efficient data structures for large flows
- Progressive loading for complex visualizations

This design provides a comprehensive foundation for implementing the 3D flow visualization system. The next step would be to create the implementation tasks based on this design.
