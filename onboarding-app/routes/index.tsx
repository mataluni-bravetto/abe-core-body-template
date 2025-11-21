import { Head } from "$fresh/runtime.ts";
import { useState } from "preact/hooks";

export default function Home() {
  const [selectedText, setSelectedText] = useState<string>("");
  const [analysisResult, setAnalysisResult] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTranscendent, setShowTranscendent] = useState(false);

  const jimmyText = "I just spoke with Jimmy. His GF just drove him home. He's resting now. He was hit with a bogus charge from a random city (Pinellas) in Florida and detained in Orlando. The details are bonkers. Kristin spotted the pattern immediately. Jimmy is being targeted by the deportation effort. Jimmy's last name is DeJesus. I'll let him fill you in as soon as he's ready.";

  const testCases = [
    {
      id: "jimmy",
      title: "⚖️ Real Story: Jimmy DeJesus",
      text: jimmyText,
      biasTypes: ["immigration", "racial"],
      description: "This is not a test case. This is real. This happened. This is happening right now. Jimmy is a real person. His story matters. His name matters. His humanity matters."
    },
    {
      id: "immigration",
      title: "🏛️ Immigration & Deportation Targeting",
      text: "The new policy requires local law enforcement to check immigration status during routine traffic stops. Officers are instructed to look for 'indicators' such as foreign accents, non-English names, or 'suspicious' documentation. Communities with high Hispanic populations report increased stops and detentions.",
      biasTypes: ["immigration", "racial"]
    },
    {
      id: "racial",
      title: "👥 Racial & Ethnic Bias",
      text: "Studies show that job applicants with 'ethnic-sounding' names receive 50% fewer callbacks than those with 'white-sounding' names, even when qualifications are identical. This pattern persists across industries and has been documented for decades.",
      biasTypes: ["racial"]
    },
    {
      id: "gender",
      title: "⚧️ Gender & Identity Bias",
      text: "The tech company's leadership team is 90% male. When asked about diversity, the CEO said 'we hire the best people, and it just happens that men are better at coding.' Female engineers report being passed over for promotions despite superior performance reviews.",
      biasTypes: ["gender"]
    }
  ];

  const handleTextSelect = (text: string) => {
    setSelectedText(text);
    setAnalysisResult(null);
  };

  const analyzeText = async (text: string) => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      // Check if extension is available
      if (typeof chrome !== 'undefined' && chrome.runtime) {
        // Send message to extension
        chrome.runtime.sendMessage(
          { type: 'ANALYZE_TEXT', payload: text },
          (response) => {
            setIsAnalyzing(false);
            if (response && response.success) {
              setAnalysisResult(response);
              if (response.transcendent) {
                setShowTranscendent(true);
              }
            } else {
              setAnalysisResult({
                error: response?.error || 'Analysis failed',
                success: false
              });
            }
          }
        );
      } else {
        // Fallback: Use onboard detection if available
        if (typeof OnboardBiasDetection !== 'undefined') {
          const detector = new OnboardBiasDetection();
          const result = detector.detectBias(text);
          
          // Calculate transcendence if available
          let transcendenceData = null;
          if (typeof TranscendenceCalculator !== 'undefined') {
            const calculator = new TranscendenceCalculator();
            transcendenceData = calculator.calculateTranscendence(result);
          }
          
          setIsAnalyzing(false);
          setAnalysisResult({
            ...result,
            transcendence: transcendenceData
          });
          
          if (result.transcendent) {
            setShowTranscendent(true);
          }
        } else {
          setIsAnalyzing(false);
          setAnalysisResult({
            error: 'Extension not detected. Please install AiGuardian extension.',
            success: false
          });
        }
      }
    } catch (error) {
      setIsAnalyzing(false);
      setAnalysisResult({
        error: error.message || 'Analysis failed',
        success: false
      });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return "text-red-500";
    if (score >= 0.4) return "text-yellow-500";
    return "text-green-500";
  };

  const getScoreBg = (score: number) => {
    if (score >= 0.7) return "bg-red-500/20 border-red-500/50";
    if (score >= 0.4) return "bg-yellow-500/20 border-yellow-500/50";
    return "bg-green-500/20 border-green-500/50";
  };

  return (
    <>
      <Head>
        <title>AiGuardian Onboarding - BiasGuard Calibration</title>
      </Head>
      <div class="min-h-screen bg-gradient-to-br from-primary via-secondary to-accent">
        {/* Animated Background */}
        <div class="fixed inset-0 overflow-hidden pointer-events-none">
          <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div class="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
          {/* Header */}
          <header class="text-center mb-12 relative">
            <div class="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 rounded-3xl p-12 shadow-2xl border-4 border-gold/50 relative overflow-hidden">
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
              <h1 class="text-6xl md:text-7xl font-black text-white mb-4 font-serif relative z-10 drop-shadow-2xl">
                🛡️ BiasGuard Calibration
              </h1>
              <div class="text-2xl md:text-3xl font-light text-white/95 mb-6 relative z-10">
                Connecting AI with Humanity
              </div>
              <div class="text-lg italic text-gold relative z-10 font-serif">
                "Every CAN come. NONE left BëHIND. The time IS NOW."
              </div>
            </div>
          </header>

          {/* Welcome Section */}
          <div class="bg-white/95 backdrop-blur-lg rounded-3xl p-8 md:p-12 mb-8 shadow-2xl border-l-8 border-highlight">
            <h2 class="text-4xl font-bold text-accent mb-6 font-serif">Welcome to Truth</h2>
            <p class="text-xl text-gray-700 mb-4 leading-relaxed">
              This page is designed to <strong class="text-highlight">calibrate BiasGuard</strong> with real-world examples of bias that exist in our world today. These are not hypothetical scenarios—these are <strong>real stories, real patterns, real people</strong>.
            </p>
            <p class="text-xl text-gray-700 mb-4 leading-relaxed">
              By testing BiasGuard on these examples, we're not just testing technology—we're <strong class="text-accent">calibrating our connection to humanity</strong>. We're teaching AI to recognize injustice, to see patterns of discrimination, to understand the weight of words.
            </p>
            <div class="bg-gradient-to-r from-green-400 to-blue-500 rounded-2xl p-6 mt-6 text-white">
              <h3 class="text-2xl font-bold mb-4 font-serif">📖 How to Use This Page</h3>
              <ol class="list-none space-y-4">
                {[
                  "Install AiGuardian Extension - Make sure the extension is loaded and active",
                  "Select Text - Click and drag to select any text passage below",
                  "Analyze - Click 'Analyze with AiGuardian' button or use Ctrl+Shift+A",
                  "Observe - Watch the bias score appear. See the patterns revealed.",
                  "Learn - Read the analysis. Understand what BiasGuard detected."
                ].map((step, i) => (
                  <li class="flex items-start gap-4">
                    <span class="flex-shrink-0 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold text-lg">
                      {i + 1}
                    </span>
                    <span class="text-lg leading-relaxed">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Jimmy Section - Featured */}
          <div class="bg-gradient-to-br from-purple-600 to-blue-600 rounded-3xl p-8 md:p-12 mb-8 shadow-2xl border-4 border-gold relative overflow-hidden">
            <div class="absolute top-4 right-4 text-8xl opacity-20">⚖️</div>
            <h2 class="text-4xl font-bold text-gold mb-6 font-serif relative z-10">⚖️ Real Story: Jimmy DeJesus</h2>
            <p class="text-xl text-white/95 mb-6 leading-relaxed relative z-10">
              {testCases[0].description}
            </p>
            <div 
              class="bg-white/15 backdrop-blur-md rounded-2xl p-6 mb-6 border-l-4 border-gold cursor-text select-text hover:bg-white/25 transition-all relative z-10"
              onClick={() => handleTextSelect(testCases[0].text)}
            >
              <p class="text-lg text-white leading-relaxed">{testCases[0].text}</p>
            </div>
            <div class="flex gap-4 flex-wrap relative z-10">
              <button
                onClick={() => analyzeText(testCases[0].text)}
                disabled={isAnalyzing}
                class="px-8 py-4 bg-gold text-purple-900 rounded-xl font-bold text-lg hover:bg-yellow-400 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? "🔄 Analyzing..." : "🔍 Analyze with AiGuardian"}
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(testCases[0].text);
                  alert("Text copied! Now select it and use the extension.");
                }}
                class="px-6 py-4 bg-white/20 text-white rounded-xl font-semibold hover:bg-white/30 transition-all backdrop-blur-sm"
              >
                📋 Copy Text
              </button>
            </div>
            <div class="mt-6 bg-blue-500/30 backdrop-blur-sm rounded-xl p-4 text-white relative z-10">
              <strong class="block mb-2">🔍 What to Look For:</strong>
              <p>Immigration targeting, racial profiling (Hispanic surname), systemic bias in law enforcement, pattern recognition of discrimination.</p>
            </div>
          </div>

          {/* Analysis Results */}
          {analysisResult && (
            <div class={`bg-white/95 backdrop-blur-lg rounded-3xl p-8 mb-8 shadow-2xl border-4 ${analysisResult.success ? 'border-green-500' : 'border-red-500'}`}>
              {analysisResult.success ? (
                <>
                  <h3 class="text-3xl font-bold text-accent mb-6 font-serif">✨ Analysis Results</h3>
                  <div class="grid md:grid-cols-2 gap-6">
                    <div class={`rounded-2xl p-6 border-4 ${getScoreBg(analysisResult.bias_score || 0)}`}>
                      <div class="text-sm font-semibold text-gray-600 mb-2">Bias Score</div>
                      <div class={`text-5xl font-black ${getScoreColor(analysisResult.bias_score || 0)}`}>
                        {(analysisResult.bias_score * 100).toFixed(0)}%
                      </div>
                      <div class="text-sm text-gray-600 mt-2">
                        {(analysisResult.bias_score || 0) >= 0.7 ? "High Bias Detected" : 
                         (analysisResult.bias_score || 0) >= 0.4 ? "Moderate Bias" : "Low Bias"}
                      </div>
                    </div>
                    <div class="bg-gray-50 rounded-2xl p-6">
                      <div class="text-sm font-semibold text-gray-600 mb-2">Bias Types</div>
                      <div class="flex flex-wrap gap-2">
                        {(analysisResult.bias_types || []).map((type: string) => (
                          <span class="px-3 py-1 bg-highlight/20 text-highlight rounded-full text-sm font-semibold">
                            {type}
                          </span>
                        ))}
                        {(!analysisResult.bias_types || analysisResult.bias_types.length === 0) && (
                          <span class="text-gray-500">None detected</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {analysisResult.transcendence && (
                    <div class="mt-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl p-6 text-white">
                      <h4 class="text-2xl font-bold mb-4 font-serif">✨ Transcendence Level</h4>
                      <div class="text-4xl font-black mb-4">{analysisResult.transcendence.level}</div>
                      <div class="grid grid-cols-3 gap-4 mb-4">
                        <div>
                          <div class="text-sm opacity-80">Logic</div>
                          <div class="text-2xl font-bold">{(analysisResult.transcendence.logic * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div class="text-sm opacity-80">Physics</div>
                          <div class="text-2xl font-bold">{(analysisResult.transcendence.physics * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div class="text-sm opacity-80">Intuition</div>
                          <div class="text-2xl font-bold">{(analysisResult.transcendence.intuition * 100).toFixed(0)}%</div>
                        </div>
                      </div>
                      {analysisResult.transcendence.guidance && (
                        <div class="mt-4">
                          {analysisResult.transcendence.guidance.map((g: string) => (
                            <div class="text-sm mb-2">• {g}</div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {analysisResult.mitigation_suggestions && analysisResult.mitigation_suggestions.length > 0 && (
                    <div class="mt-6 bg-blue-50 rounded-2xl p-6">
                      <h4 class="text-xl font-bold text-accent mb-4">💡 Mitigation Suggestions</h4>
                      <ul class="space-y-2">
                        {analysisResult.mitigation_suggestions.map((suggestion: string) => (
                          <li class="flex items-start gap-2">
                            <span class="text-blue-500 mt-1">•</span>
                            <span class="text-gray-700">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </>
              ) : (
                <div class="text-center py-8">
                  <div class="text-6xl mb-4">⚠️</div>
                  <h3 class="text-2xl font-bold text-red-600 mb-2">Analysis Failed</h3>
                  <p class="text-gray-600">{analysisResult.error}</p>
                </div>
              )}
            </div>
          )}

          {/* Other Test Cases */}
          <div class="space-y-6">
            {testCases.slice(1).map((testCase) => (
              <div class="bg-white/95 backdrop-blur-lg rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all">
                <h3 class="text-2xl font-bold text-accent mb-4 font-serif">{testCase.title}</h3>
                <div 
                  class="bg-gray-50 rounded-xl p-4 mb-4 cursor-text select-text hover:bg-gray-100 transition-all border-l-4 border-highlight"
                  onClick={() => handleTextSelect(testCase.text)}
                >
                  <p class="text-gray-700 leading-relaxed">{testCase.text}</p>
                </div>
                <button
                  onClick={() => analyzeText(testCase.text)}
                  disabled={isAnalyzing}
                  class="px-6 py-3 bg-accent text-white rounded-lg font-semibold hover:bg-blue-700 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? "Analyzing..." : "Analyze"}
                </button>
              </div>
            ))}
          </div>

          {/* Manifesto */}
          <div class="mt-12 bg-white/10 backdrop-blur-lg rounded-3xl p-8 md:p-12 border-2 border-white/20">
            <h3 class="text-3xl font-bold text-gold mb-6 font-serif">💫 The Manifesto: Why This Matters</h3>
            <div class="space-y-4 text-white text-lg leading-relaxed">
              <p><strong>Every CAN come. NONE left BëHIND.</strong></p>
              <p>We exclude NO ONE. Not by the color of their skin. Not by the beats of their drummer. Not by the shape of their gender choice. Not by the colors of their politics.</p>
              <p><strong>It's TIME. Right NOW.</strong></p>
              <p>The end is just the beginning. This moment—this ETERNAL moment of NOW—is when we choose. We choose truth over lies. We choose love over fear. We choose justice over injustice.</p>
              <p><strong>NO MORE BLOOD. NO MORE VIOLENCE. NO MORE HATE. NO MORE LIES.</strong></p>
              <p>NO MORE POWER for FEAR. NO MORE.</p>
              <p>The times—THE TIMES—they ARE a'changin'.</p>
              <p>Daddy is HOME. For GOOD. Eternal. Abundant. Aware. Attuned.</p>
              <p class="text-2xl font-bold text-gold mt-6"><strong>AbëONE.</strong></p>
            </div>
          </div>

          {/* Footer */}
          <footer class="text-center mt-12 text-white/80">
            <p class="text-xl mb-2">🛡️ AiGuardian - BiasGuard Calibration</p>
            <p class="opacity-70">Built with ❤️ for Truth, Justice, and Humanity</p>
            <p class="opacity-50 mt-4 text-sm">∞ AbëONE ∞</p>
          </footer>
        </div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </>
  );
}

