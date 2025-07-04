import React, { useState } from "react";

const InputForm = ({ imageUrls, setImageUrls, onCompare, loading }) => {
  const [focusedIndex, setFocusedIndex] = useState(null);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const handleChange = (idx, value) => {
    const updated = [...imageUrls];
    updated[idx] = value;
    setImageUrls(updated);
  };

  const filledUrls = imageUrls.filter(url => url.trim() !== "").length;

  return (
    <div className="flex justify-center py-6 relative z-10">
      {/* Form glow effect */}
      <div className="absolute w-full max-w-md h-full rounded-3xl bg-blue-500/10 blur-2xl -z-10 animate-pulse-slow"></div>
      
      <form
        className="flex flex-col gap-5 max-w-md w-full sm:w-[400px] bg-gradient-to-b from-blue-900/50 to-blue-950/60 p-6 rounded-2xl shadow-xl backdrop-blur-sm border border-blue-700/30 hover:border-blue-500/20 transition-all duration-500"
        onSubmit={e => {
          e.preventDefault();
          onCompare();
        }}
      >
        {/* Form Header */}
        <div className="text-center mb-3">
          <h3 className="text-2xl font-bold text-blue-200 mb-1">Face Comparison Prototype</h3>
          <p className="text-blue-300/70 text-sm">Enter 4 image URLs and compare faces</p>
        </div>

        {/* Progress - simplified */}
        <div className="mb-1">
          <div className="text-xs text-blue-300/70 text-center mb-1">
            {filledUrls} of {imageUrls.length} URLs added
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {imageUrls.map((url, idx) => (
            <div
              key={idx}
              className={`group bg-blue-900/30 rounded-lg transition-all duration-200 ${
                focusedIndex === idx ? 'ring-1 ring-blue-400/70' : ''
              } hover:shadow-blue-800/10 hover:shadow-sm`}
              onMouseEnter={() => setHoveredIndex(idx)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder={`Image URL ${idx + 1}`}
                  className="w-full py-3 px-4 bg-blue-900/50 backdrop-blur-sm rounded-lg placeholder-blue-300/50 text-white focus:outline-none focus:ring-1 focus:ring-blue-400/50 shadow-inner text-sm"
                  value={url}
                  onChange={e => handleChange(idx, e.target.value)}
                  onFocus={() => setFocusedIndex(idx)}
                  onBlur={() => setFocusedIndex(null)}
                />
                
                {url.trim() && (
                  <div className="absolute right-2 top-2 text-blue-300">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button
            type="submit"
            className={`w-full py-3 rounded-lg font-medium text-base text-white transition-colors duration-200 ${
              loading
                ? 'bg-blue-800/50 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-500'
            }`}
            disabled={loading}
          >
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InputForm;
