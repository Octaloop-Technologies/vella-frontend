'use client';

import React from 'react';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  showPrevious?: boolean;
  nextLabel?: string;
  previousLabel?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onPrevious,
  onNext,
  showPrevious = true,
  nextLabel = 'Next',
  previousLabel = 'Previous',
}) => {
  return (
    <div className="flex items-center justify-between mt-8">
      {showPrevious ? (
        <button
          onClick={onPrevious}
          className="px-8 py-3 rounded-[10px] border border-[#E5E7EB] bg-white text-[#1E1E1E] font-medium hover:bg-[#F9FAFB] transition-colors flex items-center space-x-2"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{previousLabel}</span>
        </button>
      ) : (
        <div />
      )}

      <button
        onClick={onNext}
        className="px-8 py-3 rounded-[10px] bg-gradient-to-b from-[#8266D4] to-[#41288A] text-white font-medium hover:opacity-90 transition-opacity flex items-center space-x-2"
      >
        <span>{nextLabel}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path
            d="M7.5 5L12.5 10L7.5 15"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
};

export default StepNavigation;
