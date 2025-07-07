import React from "react";

const ResultIcon = ({ matched }) => {
  return matched ? (
    <div className="flex flex-col items-center mt-4">
      <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-full shadow-lg mb-2">
        <span className="inline-block w-8 h-8 text-green-600" title="Match Found">
          {/* Green tick SVG */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <polyline points="20 6 9.5 17 4 11.5" />
          </svg>
        </span>
      </div>
      <span className="text-green-600 font-medium">Match Found</span>
    </div>
  ) : (
    <div className="flex flex-col items-center mt-4">
      <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full shadow-lg mb-2">
        <span className="inline-block w-8 h-8 text-red-600" title="No Match">
          {/* Red cross SVG */}
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-full h-full">
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="6" y1="18" x2="18" y2="6" />
          </svg>
        </span>
      </div>
      <span className="text-red-600 font-medium">No Match</span>
    </div>
  );
};

export default ResultIcon;
