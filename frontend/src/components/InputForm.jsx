import React, { useState } from "react";

const InputForm = ({ imageUrls, setImageUrls, onCompare, loading }) => {
  const [focusedIndex, setFocusedIndex] = useState(null);

  const handleChange = (idx, value) => {
    const updated = [...imageUrls];
    updated[idx] = value;
    setImageUrls(updated);
  };

  const filledUrls = imageUrls.filter(url => url.trim() !== "").length;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={e => {
        e.preventDefault();
        onCompare();
      }}
    >
      {/* Progress */}
      <div className="mb-1">
        <div className="text-xs text-gray-400 text-center mb-2">
          {filledUrls} of {imageUrls.length} URLs added
        </div>
      </div>
      <div className="flex flex-col gap-3">
        {imageUrls.map((url, idx) => (
          <div
            key={idx}
            className={`group bg-gray-800/60 rounded-lg transition-all duration-200 relative ${
              focusedIndex === idx ? 'ring-2 ring-indigo-500/60' : ''
            } hover:bg-gray-700/50`}
          >
            <input
              type="text"
              required
              placeholder={`Image URL ${idx + 1}`}
              className="w-full py-3 px-4 bg-transparent rounded-lg placeholder-gray-400 text-white focus:outline-none focus:ring-1 focus:ring-indigo-400/50 text-base transition"
              value={url}
              onChange={e => handleChange(idx, e.target.value)}
              onFocus={() => setFocusedIndex(idx)}
              onBlur={() => setFocusedIndex(null)}
            />
            {url.trim() && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center">
        <button
          type="submit"
          className={`px-8 py-3 rounded-xl font-medium text-white shadow-md transition-all duration-200 text-lg
            ${loading
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 btn-pulse'
            }`}
          disabled={loading}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            "Compare Faces"
          )}
        </button>
      </div>
    </form>
  );
};

export default InputForm;
