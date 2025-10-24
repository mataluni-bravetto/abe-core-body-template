# 🏗️ AiGuardian Chrome Extension - Architecture Documentation

## System Architecture

```mermaid
graph TB
    subgraph "Chrome Extension (Frontend)"
        CS[Content Script<br/>Text Selection & Analysis]
        SW[Service Worker<br/>Message Handler & Orchestration]
        PU[Popup UI<br/>User Interface & Status]
        OP[Options Page<br/>Configuration & Settings]
    end
    
    subgraph "API Gateway Layer"
        GW[Gateway Module<br/>Authentication & Routing]
        RL[Rate Limiter<br/>Request Throttling]
        VL[Input Validator<br/>Data Sanitization]
        CM[Cache Manager<br/>Response Caching]
    end
    
    subgraph "Backend Services"
        UE[Unified Endpoint<br/>/api/v1/analyze]
        GO[Guard Orchestration<br/>Server-Side Logic]
        
        subgraph "Guard Services"
            BG[BiasGuard]
            TG[TrustGuard]
            CG[ContextGuard]
            SG[SecurityGuard]
            TK[TokenGuard]
            HG[HealthGuard]
        end
    end
    
    subgraph "External Services"
        API[Backend API<br/>api.aiguardian.ai]
        DASH[Dashboard<br/>dashboard.aiguardian.ai]
        LOG[Central Logging<br/>/api/v1/logging]
    end
    
    subgraph "Storage"
        LS[Local Storage<br/>Configuration & Cache]
        CSYNC[Chrome Storage Sync<br/>Settings Sync]
    end
    
    %% Data Flow
    CS --> SW
    PU --> SW
    OP --> SW
    SW --> GW
    GW --> RL
    RL --> VL
    VL --> CM
    CM --> UE
    UE --> GO
    GO --> BG
    GO --> TG
    GO --> CG
    GO --> SG
    GO --> TK
    GO --> HG
    
    %% External Connections
    GW --> API
    PU --> DASH
    SW --> LOG
    
    %% Storage Connections
    SW --> LS
    OP --> CSYNC
    SW --> CSYNC
    
    %% Styling
    classDef frontend fill:#e1f5fe
    classDef gateway fill:#f3e5f5
    classDef backend fill:#e8f5e8
    classDef external fill:#fff3e0
    classDef storage fill:#fce4ec
    
    class CS,SW,PU,OP frontend
    class GW,RL,VL,CM gateway
    class UE,GO,BG,TG,CG,SG,TK,HG backend
    class API,DASH,LOG external
    class LS,CSYNC storage
```

## Core Functionality Flow

```mermaid
sequenceDiagram
    participant U as User
    participant CS as Content Script
    participant SW as Service Worker
    participant GW as Gateway
    participant API as Backend API
    participant UI as Popup UI
    
    Note over U,UI: Text Analysis Workflow
    
    U->>CS: Selects text (10+ chars)
    CS->>SW: Send analysis request
    SW->>GW: Process request
    GW->>GW: Validate input
    GW->>GW: Check rate limits
    GW->>API: POST /api/v1/analyze
    
    API->>API: Orchestrate guards
    API->>API: BiasGuard analysis
    API->>API: TrustGuard analysis
    API->>API: ContextGuard analysis
    API->>API: SecurityGuard analysis
    API->>API: TokenGuard analysis
    API->>API: HealthGuard analysis
    
    API->>GW: Return unified response
    GW->>SW: Process response
    SW->>CS: Update UI with results
    CS->>U: Display confidence badge
    
    Note over U,UI: User Interaction
    
    U->>UI: Click extension icon
    UI->>SW: Request status
    SW->>UI: Return service status
    UI->>U: Show "Show Me the Proof" button
    
    U->>UI: Click "Show Me the Proof"
    UI->>SW: Request detailed analysis
    SW->>GW: Get analysis details
    GW->>API: Fetch detailed results
    API->>GW: Return detailed analysis
    GW->>SW: Process details
    SW->>UI: Return detailed results
    UI->>U: Display proof and evidence
```

## Dependencies & Data Flow

```mermaid
graph LR
    subgraph "Internal Dependencies"
        CS[content.js]
        SW[service_worker.js]
        GW[gateway.js]
        PU[popup.js]
        OP[options.js]
        CN[constants.js]
        LG[logging.js]
        IV[input-validator.js]
        DE[data-encryption.js]
        RL[rate-limiter.js]
        CM[cache-manager.js]
    end
    
    subgraph "Chrome APIs"
        CR[chrome.runtime]
        CSYNC[chrome.storage.sync]
        CTX[chrome.tabs]
        CMD[chrome.commands]
    end
    
    subgraph "External Dependencies"
        API[Backend API]
        DASH[Dashboard]
        LOG[Central Logging]
    end
    
    subgraph "Data Flow"
        REQ[Analysis Request]
        RESP[Analysis Response]
        CONFIG[Configuration]
        CACHE[Response Cache]
        LOGS[Error Logs]
    end
    
    %% Internal Dependencies
    CS --> SW
    SW --> GW
    PU --> SW
    OP --> SW
    SW --> CN
    GW --> LG
    GW --> IV
    GW --> DE
    GW --> RL
    GW --> CM
    
    %% Chrome API Dependencies
    SW --> CR
    SW --> CSYNC
    CS --> CR
    PU --> CR
    OP --> CSYNC
    
    %% External Dependencies
    GW --> API
    PU --> DASH
    SW --> LOG
    
    %% Data Flow
    REQ --> GW
    GW --> API
    API --> RESP
    RESP --> GW
    GW --> CACHE
    GW --> LOGS
    
    %% Styling
    classDef internal fill:#e3f2fd
    classDef chrome fill:#f1f8e9
    classDef external fill:#fff8e1
    classDef data fill:#fce4ec
    
    class CS,SW,GW,PU,OP,CN,LG,IV,DE,RL,CM internal
    class CR,CSYNC,CTX,CMD chrome
    class API,DASH,LOG external
    class REQ,RESP,CONFIG,CACHE,LOGS data
```

## Security Architecture

```mermaid
graph TB
    subgraph "Input Security"
        IV[Input Validator]
        XSS[XSS Protection]
        HTML[HTML Sanitization]
    end
    
    subgraph "Communication Security"
        HTTPS[HTTPS Only]
        AUTH[Bearer Token Auth]
        CSP[Content Security Policy]
    end
    
    subgraph "Data Security"
        ENC[Data Encryption]
        SEC[Secure Storage]
        NOH[No Hardcoded Secrets]
    end
    
    subgraph "Runtime Security"
        RATE[Rate Limiting]
        VAL[Input Validation]
        MSG[Secure Messaging]
    end
    
    %% Security Flow
    IV --> XSS
    XSS --> HTML
    HTML --> HTTPS
    HTTPS --> AUTH
    AUTH --> CSP
    CSP --> ENC
    ENC --> SEC
    SEC --> NOH
    NOH --> RATE
    RATE --> VAL
    VAL --> MSG
    
    %% Styling
    classDef security fill:#ffebee
    classDef input fill:#e8f5e8
    classDef comm fill:#e3f2fd
    classDef data fill:#fff3e0
    classDef runtime fill:#f3e5f5
    
    class IV,XSS,HTML input
    class HTTPS,AUTH,CSP comm
    class ENC,SEC,NOH data
    class RATE,VAL,MSG runtime
```

## Performance Architecture

```mermaid
graph TB
    subgraph "Caching Layer"
        CM[Cache Manager]
        TTL[30s TTL]
        KEY[Cache Keys]
    end
    
    subgraph "Request Optimization"
        DEB[Request Debouncing]
        BATCH[Batch Requests]
        POOL[Connection Pooling]
    end
    
    subgraph "Resource Management"
        MEM[Memory Management]
        CLEAN[Event Cleanup]
        LAZY[Lazy Loading]
    end
    
    subgraph "Performance Monitoring"
        METRICS[Response Times]
        ERRORS[Error Rates]
        USAGE[Memory Usage]
    end
    
    %% Performance Flow
    CM --> TTL
    TTL --> KEY
    KEY --> DEB
    DEB --> BATCH
    BATCH --> POOL
    POOL --> MEM
    MEM --> CLEAN
    CLEAN --> LAZY
    LAZY --> METRICS
    METRICS --> ERRORS
    ERRORS --> USAGE
    
    %% Styling
    classDef cache fill:#e8f5e8
    classDef request fill:#e3f2fd
    classDef resource fill:#fff3e0
    classDef monitor fill:#f3e5f5
    
    class CM,TTL,KEY cache
    class DEB,BATCH,POOL request
    class MEM,CLEAN,LAZY resource
    class METRICS,ERRORS,USAGE monitor
```

## Deployment Architecture

```mermaid
graph TB
    subgraph "Chrome Web Store"
        EXT[Extension Package]
        STORE[Store Listing]
        REVIEW[Review Process]
    end
    
    subgraph "Production Environment"
        API[Backend API]
        DASH[Dashboard]
        LOG[Central Logging]
        MON[Monitoring]
    end
    
    subgraph "User Environment"
        CHROME[Chrome Browser]
        EXT_INST[Installed Extension]
        CONFIG[User Configuration]
    end
    
    subgraph "Development Environment"
        DEV[Local Development]
        TEST[Testing Suite]
        DEBUG[Debug Tools]
    end
    
    %% Deployment Flow
    EXT --> STORE
    STORE --> REVIEW
    REVIEW --> CHROME
    CHROME --> EXT_INST
    EXT_INST --> CONFIG
    CONFIG --> API
    API --> DASH
    API --> LOG
    LOG --> MON
    
    %% Development Flow
    DEV --> TEST
    TEST --> DEBUG
    DEBUG --> EXT
    
    %% Styling
    classDef store fill:#e8f5e8
    classDef production fill:#e3f2fd
    classDef user fill:#fff3e0
    classDef development fill:#f3e5f5
    
    class EXT,STORE,REVIEW store
    class API,DASH,LOG,MON production
    class CHROME,EXT_INST,CONFIG user
    class DEV,TEST,DEBUG development
```

## Key Architectural Decisions

### 1. Unified Endpoint Pattern
- **Single API Endpoint**: `/api/v1/analyze` handles all analysis requests
- **Backend Orchestration**: All guard logic executed server-side
- **Simplified Frontend**: Extension only handles UI and basic configuration
- **Scalable Architecture**: Easy to add new guards without frontend changes

### 2. Security-First Design
- **Input Validation**: All user inputs sanitized before processing
- **XSS Protection**: Script tag removal and HTML sanitization
- **Secure Communication**: HTTPS-only with bearer token authentication
- **Data Encryption**: Sensitive data encrypted in storage

### 3. Performance Optimization
- **Response Caching**: 30-second TTL for analysis results
- **Request Debouncing**: 300ms debounce to prevent spam
- **Memory Management**: Event listener cleanup and efficient resource usage
- **Connection Pooling**: Reuse connections for better performance

### 4. Transparency & Trust
- **Proof-First Approach**: "Show Me the Proof" button for evidence
- **Confidence Scores**: Clear indicators of analysis reliability
- **Uncertainty Flagging**: "I'm not sure" responses when uncertain
- **Audit Trails**: Complete transparency in decision making

### 5. Skeptical Engineer Focus
- **No Hype Language**: Honest about limitations and uncertainties
- **Transparent Logging**: "We don't claim perfect security. We claim transparent failure logging."
- **Evidence-Based Results**: Show reasoning, not just conclusions
- **Trust Through Transparency**: Build trust by being honest about limitations

## Future Considerations

### Scalability
- **Microservices Architecture**: Each guard could become a separate service
- **Load Balancing**: Distribute analysis requests across multiple instances
- **Caching Layers**: Redis for response caching, CDN for static assets

### Enhanced Features
- **Real-time Analysis**: WebSocket connections for live analysis
- **Custom Pipelines**: User-defined analysis workflows
- **API Versioning**: Support for multiple API versions
- **Webhook Integration**: Real-time notifications for analysis results

### Monitoring & Observability
- **Metrics Collection**: Response times, error rates, usage patterns
- **Distributed Tracing**: Track requests across all services
- **Alerting**: Proactive monitoring and incident response
- **Analytics**: User behavior and feature usage tracking