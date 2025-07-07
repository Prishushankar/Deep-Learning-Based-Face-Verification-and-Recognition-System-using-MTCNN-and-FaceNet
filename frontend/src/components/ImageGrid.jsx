import React from "react";
import ResultIcon from "./ResultIcon";

const ImageGrid = ({ imageUrls, matchResults, loading }) => {
  const validUrls = imageUrls.filter(url => url && url.trim().length > 0);
  if (validUrls.length === 0) return null;
  
  // Debug logging
  console.log('ImageGrid matchResults:', matchResults);
  console.log('ImageGrid threshold:', matchResults?.threshold);
  
  // Check if we have backend results
  const hasResults = matchResults && matchResults.matrix && matchResults.distances;

  // Helper function to get matches for a specific face - purely from backend data
  const getMatchesForFace = (faceIndex) => {
    if (!hasResults) return [];
    const matches = [];
    for (let i = 0; i < matchResults.matrix[faceIndex].length; i++) {
      if (i !== faceIndex && matchResults.matrix[faceIndex][i]) {
        matches.push({
          faceIndex: i,
          similarity: (1 - matchResults.distances[faceIndex][i]).toFixed(3),
          distance: matchResults.distances[faceIndex][i].toFixed(3)
        });
      }
    }
    return matches;
  };

  return (
    <div className="mt-16 max-w-7xl mx-auto relative z-10">
      {validUrls.length > 0 && (
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 inline-block">
            {loading ? 'Processing Images' : hasResults ? 'Comparison Results' : 'Image Preview'}
          </h2>
          {loading && (
            <p className="mt-2 text-gray-400">
              Our AI is analyzing facial features and calculating similarities
              <span className="loading-dots"></span>
            </p>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <div className="flex gap-6 justify-start">
          {validUrls.map((url, idx) => {
            // Get result data for this face - purely from backend
            let result = null;
            let matchesWithOthers = [];
            
            if (hasResults) {
              // Backend determines if this face has matches
              const hasAnyMatch = matchResults.matrix[idx].some((match, i) => i !== idx && match);
              const bestDistance = Math.min(...matchResults.distances[idx].filter((_, i) => i !== idx));
              result = { hasMatch: hasAnyMatch, bestDistance };
              matchesWithOthers = getMatchesForFace(idx);
            }

            return (
              <div
                key={idx}
                className={`glass rounded-xl overflow-hidden transition-all duration-500 card-hover min-w-[250px] ${
                  loading ? 'opacity-80' : 'opacity-100'
                }`}
              >
                <div className="bg-gradient-to-r from-gray-800/60 to-gray-900/60 border-b border-gray-700/50 p-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center text-sm font-bold">
                      {idx + 1}
                    </div>
                    <h3 className="ml-3 font-medium">Face {idx + 1}</h3>
                  </div>
                </div>
                <div className="relative">
                  <div className={`w-full h-48 ${loading ? 'animate-pulse' : ''}`}>
                    <img
                      src={url}
                      alt={`Face ${idx + 1}`}
                      className="w-full h-full object-cover"
                      onError={e => {
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
                {hasResults && result && (
                  <>
                    <div className="flex justify-center -mt-2 mb-2">
                      <ResultIcon matched={result.hasMatch} />
                    </div>
                    <div className="p-4 bg-gradient-to-r from-gray-900/60 to-gray-800/60 border-t border-gray-700/50">
                      <div className="flex flex-col items-center space-y-2">
                        <div className={`text-sm font-semibold ${result.hasMatch ? 'text-green-400' : 'text-red-400'}`}>
                          {result.hasMatch ? 'Has Matches' : 'No Matches'}
                        </div>
                        {result.bestDistance !== null && (
                          <>
                            <div className="text-xs text-gray-400 px-2 py-1 bg-gray-800/50 rounded-lg">
                              Best Similarity: {(1 - result.bestDistance).toFixed(3)}
                            </div>
                            <div className="text-xs text-gray-500">
                              Distance: {result.bestDistance.toFixed(3)}
                            </div>
                          </>
                        )}
                        {/* Show which faces this one matches with */}
                        {hasResults && matchesWithOthers.length > 0 && (
                          <div className="w-full mt-2 pt-2 border-t border-gray-600/30">
                            <div className="text-xs text-gray-400 mb-1">Matches with:</div>
                            <div className="flex flex-wrap gap-1">
                              {matchesWithOthers.map((match) => (
                                <span 
                                  key={match.faceIndex}
                                  className="px-2 py-1 bg-green-900/40 text-green-300 rounded text-xs border border-green-500/20"
                                >
                                  Face {match.faceIndex + 1} ({match.similarity})
                                </span>
                              ))}
                            </div>
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
      {hasResults && (
        <div className="mt-12 space-y-6">
          {/* Comparison Matrix */}
          {hasResults && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-400 mb-4">
                Full Comparison Matrix
              </h3>
              
              {/* Threshold Information */}
              <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/20">
                <div className="flex items-center justify-center">
                  
                  <div className="text-center">
                    <div className="text-amber-300 font-semibold">Comparison Threshold</div>
                    <div className="text-amber-200 text-sm mt-1">
                      Similarity ≥ {matchResults.threshold ? ((1 - matchResults.threshold) * 100).toFixed(1) : 'N/A'}% 
                      <span className="text-amber-400 ml-2">
                        (Distance ≤ {matchResults.threshold ? matchResults.threshold.toFixed(3) : 'N/A'})
                      </span>
                    </div>
                    <div className="text-xs text-amber-500 mt-1">
                      Faces with similarity above this threshold are considered matches
                    </div>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="p-2 text-gray-400 text-sm"></th>
                      {validUrls.map((_, idx) => (
                        <th key={idx} className="p-2 text-gray-400 text-sm font-medium">
                          Face {idx + 1}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {matchResults.matrix.map((row, i) => (
                      <tr key={i}>
                        <td className="p-2 text-gray-400 text-sm font-medium">Face {i + 1}</td>
                        {row.map((match, j) => (
                          <td key={j} className="p-2 text-center">
                            {i === j ? (
                              <div className="text-gray-500 text-xs">Self</div>
                            ) : (
                              <div className="space-y-1">
                                <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-xs font-bold ${
                                  match ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                }`}>
                                  {match ? '✓' : '✗'}
                                </div>
                                <div className="text-xs text-gray-400">
                                  {(1 - matchResults.distances[i][j]).toFixed(2)}
                                </div>
                              </div>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-xs text-gray-500 text-center space-y-1">
                <div>✓ = Match Found | ✗ = No Match | Numbers show similarity scores</div>
                {matchResults.threshold && (
                  <div className="text-amber-400">
                    Threshold: {((1 - matchResults.threshold) * 100).toFixed(1)}% similarity 
                    (distance ≤ {matchResults.threshold.toFixed(3)})
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Detailed Face Analysis */}
          <div className="glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-300 to-cyan-400 mb-4">
              Individual Face Analysis
              {matchResults.threshold && (
                <span className="text-sm text-gray-400 font-normal ml-2">
                  (Threshold: {((1 - matchResults.threshold) * 100).toFixed(1)}% similarity)
                </span>
              )}
            </h3>
            <div className="space-y-4">
              {validUrls.map((_, idx) => {
                const matches = hasResults ? getMatchesForFace(idx) : [];
                const hasAnyMatch = hasResults ? 
                  matchResults.matrix[idx].some((match, i) => i !== idx && match) : false;
                
                return (
                  <div key={idx} className="p-4 bg-gray-800/40 rounded-lg border border-gray-700/30">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <img
                            src={validUrls[idx]}
                            alt={`Face ${idx + 1}`}
                            className="w-full h-full object-cover"
                            onError={e => {
                              e.target.src = "https://via.placeholder.com/48?text=Error";
                            }}
                          />
                        </div>
                        <div>
                          <span className="text-gray-300 font-medium">Face {idx + 1}</span>
                          <div className={`text-sm ${hasAnyMatch ? 'text-green-400' : 'text-red-400'}`}>
                            {hasAnyMatch ? `${matches.length} match(es) found` : 'No matches'}
                          </div>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full ${hasAnyMatch ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    </div>
                    
                    {hasResults && matches.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-600/30">
                        <div className="text-sm text-gray-400 mb-2">Matches with:</div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {matches.map((match) => {
                            const exceedsThreshold = matchResults.threshold ? 
                              parseFloat(match.similarity) >= (1 - matchResults.threshold) : false;
                            return (
                              <div key={match.faceIndex} className="flex items-center justify-between p-2 bg-green-900/20 rounded border border-green-500/20">
                                <span className="text-green-300 text-sm">Face {match.faceIndex + 1}</span>
                                <div className="text-right">
                                  <div className="text-xs text-green-400">
                                    Similarity: {match.similarity}
                                    {exceedsThreshold && <span className="ml-1 text-amber-400">✓</span>}
                                  </div>
                                  <div className="text-xs text-gray-500">Distance: {match.distance}</div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* All Matching Pairs */}
          {hasResults && (
            <div className="glass rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-emerald-400 mb-4">
                All Matching Pairs
                {matchResults.threshold && (
                  <span className="text-sm text-gray-400 font-normal ml-2">
                    (Above {((1 - matchResults.threshold) * 100).toFixed(1)}% threshold)
                  </span>
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const pairs = [];
                  for (let i = 0; i < matchResults.matrix.length; i++) {
                    for (let j = i + 1; j < matchResults.matrix[i].length; j++) {
                      if (matchResults.matrix[i][j]) {
                        pairs.push({
                          face1: i,
                          face2: j,
                          similarity: (1 - matchResults.distances[i][j]).toFixed(3),
                          distance: matchResults.distances[i][j].toFixed(3)
                        });
                      }
                    }
                  }
                  
                  if (pairs.length === 0) {
                    return (
                      <div className="col-span-full text-center py-8 text-gray-400">
                        No matching pairs found
                      </div>
                    );
                  }
                  
                  return pairs.map((pair, pairIdx) => {
                    const exceedsThreshold = matchResults.threshold ? 
                      parseFloat(pair.similarity) >= (1 - matchResults.threshold) : false;
                    return (
                      <div key={pairIdx} className="flex items-center space-x-4 p-4 bg-green-900/20 rounded-lg border border-green-500/20">
                        <div className="flex space-x-2">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={validUrls[pair.face1]}
                              alt={`Face ${pair.face1 + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.target.src = "https://via.placeholder.com/48?text=Error";
                              }}
                            />
                          </div>
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <img
                              src={validUrls[pair.face2]}
                              alt={`Face ${pair.face2 + 1}`}
                              className="w-full h-full object-cover"
                              onError={e => {
                                e.target.src = "https://via.placeholder.com/48?text=Error";
                              }}
                            />
                          </div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-green-400">
                            Face {pair.face1 + 1} ↔ Face {pair.face2 + 1}
                            {exceedsThreshold && <span className="ml-2 text-amber-400">✓ Above Threshold</span>}
                          </div>
                          <div className="text-sm text-gray-300">
                            Similarity: {pair.similarity} ({((pair.similarity) * 100).toFixed(1)}%)
                          </div>
                          <div className="text-xs text-gray-500">
                            Distance: {pair.distance}
                          </div>
                        </div>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGrid;
