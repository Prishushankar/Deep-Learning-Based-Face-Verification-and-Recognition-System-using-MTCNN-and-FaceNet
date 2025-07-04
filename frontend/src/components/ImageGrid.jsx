import React from "react";
import ResultIcon from "./ResultIcon";

const ImageGrid = ({ imageUrls, matchResults, loading }) => {
  // Filter out empty URLs
  const validUrls = imageUrls.filter(url => url && url.trim().length > 0);

  if (validUrls.length === 0) {
    return null;
  }

  const hasResults = matchResults && matchResults.length > 0;

  return (
    <div className="mt-16 max-w-7xl mx-auto">
      {validUrls.length > 0 && (
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 inline-block">
            {loading ? 'Processing Images' : hasResults ? 'Comparison Results' : 'Image Preview'}
          </h2>
          {loading && (
            <p className="mt-2 text-gray-400">
              Our AI is analyzing facial features and calculating similarities<span className="loading-dots"></span>
            </p>
          )}
        </div>
      )}

      {/* Horizontal scrollable row */}
      <div className="overflow-x-auto">
        <div className="flex gap-6 justify-start">
          {validUrls.map((url, idx) => {
            const result = hasResults ? matchResults[idx] : null;

            return (
              <div
                key={idx}
                className={`glass rounded-xl overflow-hidden transition-all duration-500 card-hover min-w-[250px] ${
                  loading ? 'opacity-80' : 'opacity-100'
                }`}
              >
                {/* Card Header */}
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-b border-gray-700/50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                        {idx + 1}
                      </div>
                      <h3 className="ml-3 font-medium">Face {idx + 1}</h3>
                    </div>
                  </div>
                </div>

                {/* Image Container */}
                <div className="relative">
                  <div className={`w-full h-48 ${loading ? 'animate-pulse' : ''}`}>
                    <img
                      src={url}
                      alt={`Face ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://via.placeholder.com/100?text=Error";
                      }}
                    />
                  </div>

                  {loading && (
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <div className="px-3 py-1 bg-black/50 rounded-lg text-sm font-medium text-gray-300">
                        Analyzing...
                      </div>
                    </div>
                  )}
                </div>

                {/* Results Icon and Section */}
                {hasResults && result && (
                  <>
                    {/* Result Icon positioned below the image */}
                    <div className="flex justify-center -mt-2 mb-2">
                      <ResultIcon matched={result.hasMatch} />
                    </div>
                    
                    <div className="p-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 border-t border-gray-700/50">
                      <div className="flex flex-col items-center">
                        {result.bestDistance !== null && (
                          <div className="text-xs text-gray-400 px-2 py-1 bg-gray-800/50 rounded-lg">
                            Similarity: {(1 - result.bestDistance).toFixed(3)}
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Summary Section */}
      {hasResults && (
        <div className="mt-12 glass rounded-2xl p-6 text-center">
          <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-400 mb-4">Analysis Summary</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 glass rounded-xl">
              <p className="text-sm text-indigo-300 font-medium mb-1">Matches Found</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-500">
                {matchResults.filter(r => r.hasMatch).length}
              </p>
            </div>
            <div className="p-4 glass rounded-xl">
              <p className="text-sm text-indigo-300 font-medium mb-1">Total Images</p>
              <p className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-500">
                {validUrls.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
