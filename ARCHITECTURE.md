# 🏗️ AiGuardian Chrome Extension - Architecture Documentation

## 📐 System Architecture

### **High-Level Architecture**

```mermaid
graph TB
    subgraph "Chrome Browser"
        UI[User Interface]
        Toolbar[Extension Icon]
        
        subgraph "Extension Components"
            Popup[Popup UI<br/>popup.html/js/css]
            Options[Options Page<br/>options.html/js]
            Content[Content Script<br/>content.js]
            SW[Service Worker<br/>service-worker.js]
            
            subgraph "Core Modules"
                Gateway[AiGuardianGateway<br/>gateway.js]
                Cache[CacheManager<br/>cache-manager.js]
                Logger[Logger<br/>logging.js]
                Validator[InputValidator<br/>input-validator.js]
                Optimizer[StringOptimizer<br/>string-optimizer.js]
                RateLimit[RateLimiter<br/>rate-limiter.js]
                Encryption[DataEncryption<br/>data-encryption.js]
                Constants[Constants<br/>constants.js]
            end
        end
        
        Storage[(Chrome Storage<br/>chrome.storage.sync)]
    end
    
    subgraph "Backend Services"
        API[AiGuardian API<br/>api.aiguardian.ai]
        
        subgraph "API Endpoints"
            Analyze[/gateway/unified<br/>Text Analysis]
            Health[/health/live<br/>Health Check]
            Logging[/api/v1/logging<br/>Centralized Logs]
            Guards[/api/v1/guards<br/>Guard Services]
            Config[/api/v1/config<br/>Configuration]
        end
    end
    
    %% User Interactions
    UI -->|Click| Toolbar
    Toolbar -->|Open| Popup
    Popup -->|Configure| Options
    
    %% Content Script Flow
    UI -->|Select Text| Content
    Content -->|Send Message| SW
    
    %% Popup Flow
    Popup -->|Send Message| SW
    Options -->|Update Settings| Storage
    
    %% Service Worker Flow
    SW -->|Initialize| Gateway
    SW -->|Read/Write| Storage
    
    %% Gateway Flow
    Gateway -->|Use| Cache
    Gateway -->|Use| Logger
    Gateway -->|Use| Validator
    Gateway -->|Use| Optimizer
    Gateway -->|Use| RateLimit
    Gateway -->|Use| Encryption
    Gateway -->|Read| Constants
    
    %% API Communication
    Gateway -->|HTTPS POST| Analyze
    Gateway -->|HTTPS POST| Health
    Gateway -->|HTTPS POST| Logging
    Gateway -->|HTTPS GET/POST| Guards
    Gateway -->|HTTPS GET/POST| Config
    
    %% Response Flow
    API -->|JSON Response| Gateway
    Gateway -->|Process| SW
    SW -->|Update| Content
    SW -->|Update| Popup
    
    style Gateway fill:#33B8FF,stroke:#1C64D9,stroke-width:3px
    style SW fill:#134390,stroke:#081C3D,stroke-width:2px
    style API fill:#1C64D9,stroke:#081C3D,stroke-width:2px
```

---

## 🔄 Data Flow Diagram

### **Text Analysis Flow**

```mermaid
sequenceDiagram
    participant User
    participant WebPage
    participant Content as Content Script
    participant SW as Service Worker
    participant Gateway
    participant Cache
    participant API as Backend API
    
    User->>WebPage: Select Text
    WebPage->>Content: mouseup event
    Content->>Content: Validate selection length
    Content->>SW: chrome.runtime.sendMessage<br/>{type: "ANALYZE_TEXT"}
    
    SW->>SW: validateMessage()
    SW->>Gateway: handleTextAnalysis()
    
    Gateway->>Gateway: sanitizeRequestData()
    Gateway->>Gateway: validateRequest()
    Gateway->>Cache: Check cache
    
    alt Cache Hit
        Cache-->>Gateway: Return cached result
        Gateway-->>SW: Analysis result
    else Cache Miss
        Gateway->>API: POST /gateway/unified
        API-->>Gateway: Analysis response
        Gateway->>Cache: Store in cache
        Gateway-->>SW: Analysis result
    end
    
    SW-->>Content: sendResponse()
    Content->>Content: displayAnalysisResults()
    Content->>WebPage: Show badge + highlight
    WebPage->>User: Visual feedback
```

### **Configuration Flow**

```mermaid
sequenceDiagram
    participant User
    participant Options as Options Page
    participant Storage as Chrome Storage
    participant SW as Service Worker
    participant Gateway
    participant API as Backend API
    
    User->>Options: Open options page
    Options->>Storage: chrome.storage.sync.get()
    Storage-->>Options: Current settings
    Options->>User: Display form
    
    User->>Options: Update settings
    Options->>Options: Validate input
    Options->>Storage: chrome.storage.sync.set()
    Storage-->>Options: Confirm save
    
    Options->>SW: Notify settings changed
    SW->>Gateway: loadConfiguration()
    Gateway->>Storage: Read new settings
    Storage-->>Gateway: Settings data
    Gateway->>Gateway: Update internal config
    
    opt Test Connection
        Options->>SW: TEST_GATEWAY_CONNECTION
        SW->>Gateway: testGatewayConnection()
        Gateway->>API: POST /health/live
        API-->>Gateway: Health status
        Gateway-->>SW: Connection result
        SW-->>Options: Display result
        Options->>User: Show success/error
    end
```

---

## 🧩 Component Architecture

### **Service Worker (Background Script)**

```mermaid
graph LR
    subgraph "Service Worker"
        Init[Initialize]
        MsgHandler[Message Handler]
        
        subgraph "Message Handlers"
            AnalyzeText[handleTextAnalysis]
            GetStatus[handleGuardStatusRequest]
            UpdateConfig[handleCentralConfigUpdate]
            GetDiag[handleDiagnosticsRequest]
            TestConn[handleGatewayConnectionTest]
        end
        
        subgraph "Utilities"
            ValidateMsg[validateMessage]
            ValidateOrigin[validateOrigin]
            InitSettings[initializeDefaultSettings]
        end
    end
    
    Init -->|Create| Gateway[AiGuardianGateway]
    Init -->|Call| InitSettings
    
    MsgHandler -->|Route| AnalyzeText
    MsgHandler -->|Route| GetStatus
    MsgHandler -->|Route| UpdateConfig
    MsgHandler -->|Route| GetDiag
    MsgHandler -->|Route| TestConn
    
    MsgHandler -->|Validate| ValidateMsg
    MsgHandler -->|Validate| ValidateOrigin
    
    AnalyzeText -->|Use| Gateway
    GetStatus -->|Use| Gateway
    UpdateConfig -->|Use| Gateway
    GetDiag -->|Use| Gateway
    TestConn -->|Use| Gateway
```

### **Content Script Architecture**

```mermaid
graph TB
    subgraph "Content Script"
        EventListeners[Event Listeners]
        
        subgraph "Core Functions"
            Analyze[analyzeSelection]
            Display[displayAnalysisResults]
            Highlight[highlightSelection]
            ShowBadge[showBadge]
        end
        
        subgraph "Utilities"
            GetColor[getScoreColor]
            Cleanup[cleanup]
            ClearHighlights[clearHighlights]
        end
        
        subgraph "State"
            DebounceTimer[debounceTimer]
            CurrentBadge[currentBadge]
            ActiveHighlights[activeHighlights]
        end
    end
    
    EventListeners -->|mouseup| Analyze
    EventListeners -->|keydown| Analyze
    
    Analyze -->|Send to SW| ServiceWorker[Service Worker]
    ServiceWorker -->|Response| Display
    
    Display -->|Call| Highlight
    Display -->|Call| ShowBadge
    Display -->|Use| GetColor
    
    Highlight -->|Update| ActiveHighlights
    ShowBadge -->|Update| CurrentBadge
    
    Cleanup -->|Clear| DebounceTimer
    Cleanup -->|Call| ClearHighlights
    ClearHighlights -->|Clear| ActiveHighlights
```

---

## 🔐 Security Architecture

```mermaid
graph TB
    subgraph "Security Layers"
        Input[User Input]
        
        subgraph "Layer 1: Input Validation"
            LengthCheck[Length Validation]
            TypeCheck[Type Validation]
            FormatCheck[Format Validation]
        end
        
        subgraph "Layer 2: Sanitization"
            XSSFilter[XSS Filter]
            InjectionFilter[SQL Injection Filter]
            ScriptFilter[Script Tag Filter]
            EntityEncode[HTML Entity Encoding]
        end
        
        subgraph "Layer 3: Request Validation"
            EndpointCheck[Endpoint Validation]
            PayloadCheck[Payload Validation]
            OriginCheck[Origin Validation]
        end
        
        subgraph "Layer 4: Rate Limiting"
            TokenBucket[Token Bucket Algorithm]
            RequestQueue[Request Queue]
        end
        
        subgraph "Layer 5: Encryption"
            DataEncrypt[Data Encryption]
            SecureTransport[HTTPS Transport]
        end
        
        Output[Sanitized Output]
    end
    
    Input --> LengthCheck
    LengthCheck --> TypeCheck
    TypeCheck --> FormatCheck
    
    FormatCheck --> XSSFilter
    XSSFilter --> InjectionFilter
    InjectionFilter --> ScriptFilter
    ScriptFilter --> EntityEncode
    
    EntityEncode --> EndpointCheck
    EndpointCheck --> PayloadCheck
    PayloadCheck --> OriginCheck
    
    OriginCheck --> TokenBucket
    TokenBucket --> RequestQueue
    
    RequestQueue --> DataEncrypt
    DataEncrypt --> SecureTransport
    
    SecureTransport --> Output
    
    style XSSFilter fill:#FF5757,stroke:#991b1b,stroke-width:2px
    style InjectionFilter fill:#FF5757,stroke:#991b1b,stroke-width:2px
    style TokenBucket fill:#33B8FF,stroke:#1C64D9,stroke-width:2px
    style DataEncrypt fill:#33B8FF,stroke:#1C64D9,stroke-width:2px
```

---

## 📊 State Management

```mermaid
stateDiagram-v2
    [*] --> Uninitialized
    
    Uninitialized --> Initializing: Extension Installed
    Initializing --> LoadingConfig: Load Settings
    LoadingConfig --> Ready: Config Loaded
    LoadingConfig --> Error: Load Failed
    
    Ready --> Analyzing: User Selects Text
    Analyzing --> Processing: Send to Gateway
    Processing --> CacheCheck: Check Cache
    
    CacheCheck --> Responding: Cache Hit
    CacheCheck --> APICall: Cache Miss
    
    APICall --> Responding: API Success
    APICall --> Error: API Failure
    
    Responding --> DisplayResults: Process Response
    DisplayResults --> Ready: Show to User
    
    Error --> Ready: Show Error Message
    
    Ready --> Configuring: User Opens Options
    Configuring --> Saving: User Saves Settings
    Saving --> Ready: Settings Saved
    Saving --> Error: Save Failed
    
    Ready --> Testing: User Tests Connection
    Testing --> Ready: Test Complete
```

---

## 🗄️ Storage Architecture

```mermaid
graph TB
    subgraph "Chrome Storage (chrome.storage.sync)"
        Settings[Settings]
        
        subgraph "Configuration Data"
            GatewayURL[gateway_url]
            APIKey[api_key]
            GuardServices[guard_services]
            LoggingConfig[logging_config]
            AnalysisPipeline[analysis_pipeline]
        end
        
        subgraph "Runtime Data"
            LastSync[last_sync_time]
            RequestCount[request_count]
            ErrorLog[error_log]
        end
    end
    
    subgraph "Memory Cache"
        ResponseCache[Response Cache]
        RequestQueue[Request Queue]
        TraceStats[Trace Statistics]
    end
    
    Settings --> GatewayURL
    Settings --> APIKey
    Settings --> GuardServices
    Settings --> LoggingConfig
    Settings --> AnalysisPipeline
    
    Settings --> LastSync
    Settings --> RequestCount
    Settings --> ErrorLog
    
    Gateway[AiGuardianGateway] -->|Read| Settings
    Gateway -->|Write| Settings
    Gateway -->|Use| ResponseCache
    Gateway -->|Use| RequestQueue
    Gateway -->|Update| TraceStats
```

---

## 🔌 External Dependencies

```mermaid
graph LR
    subgraph "Chrome Extension"
        Extension[AiGuardian Extension]
    end
    
    subgraph "Chrome APIs"
        Runtime[chrome.runtime]
        Storage[chrome.storage]
        Tabs[chrome.tabs]
        Alarms[chrome.alarms]
    end
    
    subgraph "Web APIs"
        Fetch[Fetch API]
        Selection[Selection API]
        DOM[DOM API]
    end
    
    subgraph "External Services"
        Backend[AiGuardian API<br/>api.aiguardian.ai]
        Dashboard[Dashboard<br/>dashboard.aiguardian.ai]
        Website[Website<br/>aiguardian.ai]
    end
    
    Extension -->|Uses| Runtime
    Extension -->|Uses| Storage
    Extension -->|Uses| Tabs
    Extension -->|Uses| Alarms
    
    Extension -->|Uses| Fetch
    Extension -->|Uses| Selection
    Extension -->|Uses| DOM
    
    Extension -->|HTTPS| Backend
    Extension -->|Links to| Dashboard
    Extension -->|Links to| Website
    
    style Backend fill:#1C64D9,stroke:#081C3D,stroke-width:2px
    style Extension fill:#33B8FF,stroke:#1C64D9,stroke-width:3px
```

---

## 📦 Module Dependencies

```mermaid
graph TB
    subgraph "Core Modules"
        Constants[constants.js]
        Logging[logging.js]
    end
    
    subgraph "Utility Modules"
        StringOpt[string-optimizer.js]
        CacheMan[cache-manager.js]
        InputVal[input-validator.js]
        RateLimit[rate-limiter.js]
        DataEnc[data-encryption.js]
    end
    
    subgraph "Gateway Module"
        Gateway[gateway.js]
    end
    
    subgraph "Main Scripts"
        ServiceWorker[service-worker.js]
        Content[content.js]
        Popup[popup.js]
        Options[options.js]
    end
    
    %% Dependencies
    Gateway -->|imports| Constants
    Gateway -->|imports| Logging
    Gateway -->|imports| StringOpt
    Gateway -->|imports| CacheMan
    Gateway -->|imports| InputVal
    Gateway -->|imports| RateLimit
    Gateway -->|imports| DataEnc
    
    ServiceWorker -->|imports| Constants
    ServiceWorker -->|imports| Logging
    ServiceWorker -->|imports| StringOpt
    ServiceWorker -->|imports| CacheMan
    ServiceWorker -->|imports| Gateway
    
    Content -->|uses| Constants
    Content -->|uses| Logging
    
    Popup -->|uses| Logging
    Options -->|uses| Logging
    
    style Gateway fill:#33B8FF,stroke:#1C64D9,stroke-width:3px
    style ServiceWorker fill:#134390,stroke:#081C3D,stroke-width:2px
```

---

## 🎯 Core Functionalities

### **1. Text Analysis**
- **Purpose:** Analyze selected text for bias, emotional language, and objectivity
- **Components:** Content Script → Service Worker → Gateway → Backend API
- **Output:** Bias score (0-1), bias type, confidence level

### **2. Configuration Management**
- **Purpose:** Allow users to configure backend URL, API keys, and guard services
- **Components:** Options Page → Chrome Storage → Service Worker → Gateway
- **Persistence:** Chrome Storage Sync (syncs across devices)

### **3. Connection Testing**
- **Purpose:** Verify backend API connectivity and measure response time
- **Components:** Popup → Service Worker → Gateway → Backend API
- **Output:** Connection status, response time in milliseconds

### **4. Centralized Logging**
- **Purpose:** Send all logs to backend for centralized monitoring
- **Components:** All modules → Gateway → Backend API
- **Features:** Automatic sanitization, metadata enrichment

### **5. Caching**
- **Purpose:** Reduce API calls and improve performance
- **Components:** Cache Manager → Gateway
- **Strategy:** LRU cache with TTL, request deduplication

### **6. Rate Limiting**
- **Purpose:** Prevent abuse and manage API quota
- **Components:** Rate Limiter → Gateway
- **Algorithm:** Token bucket with configurable limits

### **7. Security**
- **Purpose:** Protect against XSS, injection attacks, and unauthorized access
- **Components:** Input Validator → Gateway → All modules
- **Features:** Input sanitization, origin validation, request validation

---

## 🚀 Deployment Architecture

```mermaid
graph TB
    subgraph "Development"
        DevCode[Source Code]
        DevTest[Testing]
    end
    
    subgraph "Build Process"
        Validate[Validate Manifest]
        Package[Package Extension]
        Sign[Sign Extension]
    end
    
    subgraph "Distribution"
        ChromeStore[Chrome Web Store]
        Enterprise[Enterprise Distribution]
        Unpacked[Unpacked Loading]
    end
    
    subgraph "User Installation"
        UserBrowser[User's Chrome Browser]
    end
    
    DevCode --> DevTest
    DevTest --> Validate
    Validate --> Package
    Package --> Sign
    
    Sign --> ChromeStore
    Sign --> Enterprise
    Sign --> Unpacked
    
    ChromeStore --> UserBrowser
    Enterprise --> UserBrowser
    Unpacked --> UserBrowser
```

---

## 📈 Performance Considerations

### **Optimization Strategies:**

1. **Caching**
   - Response caching with TTL
   - Request deduplication
   - LRU eviction policy

2. **Debouncing**
   - Text selection debounced (300ms)
   - Prevents excessive API calls

3. **Lazy Loading**
   - Gateway initialized on demand
   - Modules loaded only when needed

4. **String Optimization**
   - Efficient string operations
   - Memory-conscious processing

5. **Rate Limiting**
   - Token bucket algorithm
   - Prevents API quota exhaustion

---

**Last Updated:** October 26, 2025  
**Version:** 1.0.0  
**Architecture Status:** ✅ Production Ready

