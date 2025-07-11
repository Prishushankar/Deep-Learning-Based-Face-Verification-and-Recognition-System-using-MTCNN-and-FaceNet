import React, { useState } from "react";
import InputForm from "./InputForm";
import ImageGrid from "./ImageGrid";

export default function FaceComparisonPage() {
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [matchResults, setMatchResults] = useState([]);
  const [error, setError] = useState("");

  // Simulate or handle face comparison API
  const onCompare = async () => {
    setLoading(true);
    setError("");
    setMatchResults([]);
    try {
      const validUrls = imageUrls.filter(url => url.trim() !== "");
      if (validUrls.length === 0) {
        throw new Error("Please enter at least one valid image URL");
      }
      // Real backend API call
      const response = await fetch('https://facerecognitionbackend-7ow3.onrender.com/compare', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          urls: validUrls 
        })
      });

      if (!response.ok) {
        // Try to get error message from backend
        let errorMsg = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData && errorData.error) {
            errorMsg = errorData.error;
          }
        } catch (e) {}
        throw new Error(errorMsg);
      }

      const backendResponse = await response.json();
      console.log('Backend response:', backendResponse);
      console.log('Threshold from backend:', backendResponse.threshold);

      setMatchResults(backendResponse);
      setLoading(false);
    } catch (err) {
      // Show more helpful error for network/CORS/image issues
      if (err.message && err.message.includes('Failed to fetch')) {
        setError('Could not reach backend.\nPossible reasons:\n- Backend is sleeping or crashed (Render free tier)\n- CORS error (check backend CORS settings)\n- Image URLs are not public or accessible by backend');
      } else {
        setError(err.message || "Unknown error occurred.");
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>

      <main className="flex-1 w-full flex flex-col items-center justify-center z-10 relative">
        {/* Header */}
        <header className="w-full py-10 text-center mb-6 z-20">
          <h1
            style={{
              fontWeight: "bold",
              fontSize: "3rem",
              textAlign: "center",
              background: "linear-gradient(90deg, #60a5fa, #a78bfa, #f472b6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: "1rem",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              display: "inline-block"
            }}
          >
            Face Comparison AI Prototype
          </h1>
          <p className="text-blue-200/80 text-lg sm:text-xl font-light mt-1">
            Advanced facial recognition & similarity analysis<br />
            <span className="text-blue-400/70 text-base font-medium">
              Upload 4 image URLs to discover facial similarities
            </span>
          </p>
        </header>

        {/* Form and Info Section */}
        <section className="flex flex-col md:flex-row gap-8 items-center w-full max-w-3xl z-20">
          <div className="w-full max-w-md">
            <InputForm
              imageUrls={imageUrls}
              setImageUrls={setImageUrls}
              onCompare={onCompare}
              loading={loading}
            />
            {error && (
              <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/20 animate-fade-in">
                <div className="flex items-start">
                  <div className="flex-shrink-0 mt-0.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-300">Analysis Failed</h3>
                    <p className="mt-1 text-sm text-red-200">{error}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="max-w-xs w-full bg-blue-950/60 rounded-2xl p-6 shadow-xl border border-blue-800/40 backdrop-blur-md mt-2 md:mt-0">
            <h4 className="text-blue-100 font-semibold mb-2">
              How it works
            </h4>
            <ul className="text-blue-300/90 text-sm leading-6 space-y-1">
              <li>✔️ Paste 4 image URLs containing clear, front-facing faces.</li>
              <li>✔️ Click <b>Compare</b> to analyze facial similarity.</li>
              <li>✔️ Powered by <span className="text-blue-400 font-medium">DeepFace AI</span> neural networks.</li>
              <li>🔒 Your images are <b>never stored</b>. Only compared in-memory.</li>
            </ul>
          </div>
        </section>

        {/* Image grid/results */}
        <ImageGrid imageUrls={imageUrls} matchResults={matchResults} loading={loading} />
      </main>

      <footer className="w-full py-6 text-center text-blue-300/70 text-xs tracking-wide bg-gradient-to-t from-blue-950/80 via-blue-900/20 to-transparent z-20">
        Face comparison powered by <span className="text-blue-400 font-bold">DeepFace AI</span> & Neural Networks &bull; &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}
