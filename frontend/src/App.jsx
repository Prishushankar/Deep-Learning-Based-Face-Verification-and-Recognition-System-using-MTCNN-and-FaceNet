
import { useState } from "react";
import InputForm from "./components/InputForm";
import ImageGrid from "./components/ImageGrid";

function App() {
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [matchResults, setMatchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle compare button click
  const handleCompare = async () => {
    setLoading(true);
    setError("");
    setMatchResults([]);
    try {
      // Check if we have at least one valid URL
      const validUrls = imageUrls.filter(url => url.trim() !== "");
      if (validUrls.length === 0) {
        throw new Error("Please enter at least one valid image URL");
      }
      
      // Use environment variable or default to local development URL
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8001";
      console.log("Using API URL:", API_URL);
      
      // Make request to backend
      const response = await fetch(`${API_URL}/compare`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ urls: imageUrls }),
      });
      
      // Handle HTTP errors
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Backend error (${response.status}): ${errorText}`);
      }
      
      const data = await response.json();
      
      // Check if backend returned an error
      if (data.error) {
        throw new Error(`API Error: ${data.error}`);
      }
      console.log("Backend response:", data);
      console.log("Matrix:", data.matrix);
      console.log("Distances:", data.distances);
      
      // Special handling for identical images
      const uniqueUrls = [...new Set(imageUrls.filter(url => url.trim() !== ""))];
      console.log("Unique URLs count:", uniqueUrls.length);
      console.log("Total valid URLs:", imageUrls.filter(url => url.trim() !== "").length);
      
      // If all images are identical, force all to match
      const allIdentical = uniqueUrls.length === 1 && uniqueUrls[0] !== "";
      console.log("All images identical:", allIdentical);
      
      // Process results to find best matches for each image
      const results = data.matrix.map((row, idx) => {
        const matches = [];
        const distances = [];
        
        console.log(`Processing row ${idx}:`, row);
        
        // Force all to match if images are identical
        if (allIdentical) {
          for (let j = 0; j < row.length; j++) {
            if (j !== idx && imageUrls[j].trim() !== "") {
              matches.push(j);
              distances.push(0);
            }
          }
        } else {
          row.forEach((isMatch, j) => {
            if (j !== idx) { // Skip self-comparison
              console.log(`Comparing [${idx}][${j}]: match=${isMatch}, distance=${data.distances[idx][j]}`);
              if (isMatch) {
                matches.push(j);
                distances.push(data.distances[idx][j]);
              }
            }
          });
        }
        
        const hasMatch = matches.length > 0;
        console.log(`Image ${idx} has matches: ${hasMatch}, with: ${matches.join(', ')}`);
        
        return {
          hasMatch: hasMatch,
          matches: matches,
          bestDistance: matches.length > 0 ? Math.min(...distances) : null,
          allDistances: distances
        };
      });
      
      console.log("Processed results:", results);
      setMatchResults(results);
    } catch (err) {
      console.error("Comparison error:", err);
      
      // Provide more specific error messages
      if (err.message.includes("Failed to fetch")) {
        setError("Cannot connect to backend server. Please ensure the backend is running and accessible.");
      } else if (err.message.includes("NetworkError")) {
        setError("Network error. Please check your internet connection.");
      } else if (err.message.includes("No face detected")) {
        setError("No faces were detected in one or more images. Please use clear images with visible faces.");
      } else {
        // Use the error message from the backend if available
        setError(err.message || "Failed to compare faces. Please check image URLs and backend.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 relative">
      {/* Animated background */}
      <div className="animated-bg">
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
        <div className="bg-shape"></div>
      </div>
      
      {/* Header Section */}
      <div className="max-w-4xl mx-auto mb-12">
        <h1 className="text-5xl font-extrabold text-center mb-3 bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500">
          Face Comparison AI
        </h1>
        <p className="text-xl text-center text-gray-300 mb-2">Advanced facial recognition technology</p>
        <p className="text-center text-gray-400">Upload 4 image URLs to discover facial similarities</p>
      </div>
      
      {/* Main Form Card */}
      <div className="glass rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto transform transition-all">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-400 mb-2">
            Image URLs
          </h2>
          <p className="text-gray-400 text-sm">
            Enter the URLs of four images containing faces to analyze and compare
          </p>
        </div>
        
        <InputForm
          imageUrls={imageUrls}
          setImageUrls={setImageUrls}
          onCompare={handleCompare}
          loading={loading}
        />
        
        {error && (
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-red-900/40 to-pink-900/40 border border-red-500/20">
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
      
      {/* Results Section */}
      <ImageGrid imageUrls={imageUrls} matchResults={matchResults} loading={loading} />
      
      {/* Footer */}
      <div className="max-w-4xl mx-auto mt-16 text-center">
        <p className="text-sm text-gray-500">
          Face comparison powered by DeepFace AI & Neural Networks
        </p>
        
      </div>
    </div>
  );
}

export default App;
