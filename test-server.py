"""
Minimal test server for AI Guardians Chrome Extension
Provides the /gateway/unified endpoint with mock responses
"""

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any, Optional
import time
import uvicorn

app = FastAPI(title="AI Guardians Test Server")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UnifiedAnalysisRequest(BaseModel):
    analysis_id: str
    text: str
    options: Optional[Dict[str, Any]] = {}


class UnifiedAnalysisResponse(BaseModel):
    analysis_id: str
    overall_score: float
    confidence: float
    results: Dict[str, Any]
    timestamp: str
    processing_time: float
    status: str = "completed"


@app.get("/health/live")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "alive",
        "service": "codeguardians-gateway-test",
        "version": "1.0.0",
        "timestamp": time.time()
    }


@app.post("/gateway/unified")
async def unified_gateway(request: UnifiedAnalysisRequest):
    """
    Unified gateway endpoint for Chrome extension testing
    Returns mock analysis results from all guard services
    """
    start_time = time.time()

    # Mock results from guard services
    results = {
        "biasguard": {
            "enabled": True,
            "status": "completed",
            "score": 0.85,
            "data": {
                "bias_detected": False,
                "confidence": 0.92,
                "suggestions": ["Content appears balanced and fair"],
                "analysis": {
                    "political_bias": 0.1,
                    "gender_bias": 0.05,
                    "racial_bias": 0.02
                }
            },
            "processing_time": 0.125
        },
        "trustguard": {
            "enabled": True,
            "status": "completed",
            "score": 0.78,
            "data": {
                "trust_score": 0.78,
                "reliability": "high",
                "concerns": [],
                "analysis": {
                    "source_credibility": 0.85,
                    "fact_checking": 0.75,
                    "transparency": 0.90
                }
            },
            "processing_time": 0.095
        },
        "contextguard": {
            "enabled": True,
            "status": "completed",
            "score": 0.92,
            "data": {
                "context_clear": True,
                "drift_detected": False,
                "suggestions": ["Context is well maintained"],
                "analysis": {
                    "clarity": 0.95,
                    "coherence": 0.90,
                    "consistency": 0.88
                }
            },
            "processing_time": 0.110
        },
        "securityguard": {
            "enabled": True,
            "status": "completed",
            "score": 0.95,
            "data": {
                "threats_detected": False,
                "security_score": 0.95,
                "vulnerabilities": [],
                "analysis": {
                    "injection_risk": 0.01,
                    "xss_risk": 0.02,
                    "data_exposure": 0.01
                }
            },
            "processing_time": 0.088
        },
        "tokenguard": {
            "enabled": True,
            "status": "completed",
            "score": 0.88,
            "data": {
                "optimized": True,
                "token_savings": 15,
                "suggestions": ["Token usage is efficient"],
                "analysis": {
                    "original_tokens": 250,
                    "optimized_tokens": 213,
                    "efficiency": 0.88
                }
            },
            "processing_time": 0.072
        }
    }

    # Calculate overall metrics
    total_score = sum(r["score"] for r in results.values())
    overall_score = total_score / len(results)
    confidence = len([r for r in results.values() if r["status"] == "completed"]) / len(results)
    processing_time = time.time() - start_time

    response = UnifiedAnalysisResponse(
        analysis_id=request.analysis_id,
        overall_score=round(overall_score, 2),
        confidence=round(confidence, 2),
        results=results,
        timestamp=request.options.get("timestamp", ""),
        processing_time=round(processing_time, 3),
        status="completed"
    )

    print(f"Unified gateway request completed: {request.analysis_id}")
    print(f"   Score: {response.overall_score}, Confidence: {response.confidence}")
    print(f"   Text length: {len(request.text)} characters")

    return response


if __name__ == "__main__":
    print("="*60)
    print("AI Guardians Test Server Starting...")
    print("="*60)
    print("Health Check:  http://localhost:8000/health/live")
    print("Unified API:   POST http://localhost:8000/gateway/unified")
    print("="*60)
    print("Ready for Chrome Extension testing!")
    print("="*60)

    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info"
    )
