'use client';

import React from 'react';

interface StepNavigationProps {
  onPrevious: () => void;
  onNext: () => void;
  nextLabel?: string;
  previousLabel?: string;
}

const StepNavigation: React.FC<StepNavigationProps> = ({
  onPrevious,
  onNext,
  nextLabel = 'Next',
  previousLabel = 'Previous',
}) => {
  return (
    <div className="absolute bottom-8 left-0 w-full flex items-center justify-between mt-8 px-10">

      <button
        onClick={onPrevious}
        className="px-8 py-3 w-64 rounded-[10px] border border-[#8266D4] bg-white text-[#8266D4] shadow-card font-medium hover:bg-[#F9FAFB] transition-colors flex items-center justify-center space-x-3"
      >
        <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1.83361 4.83323L1.24444 5.42239L0.655273 4.83323L1.24444 4.24406L1.83361 4.83323ZM16.0003 11.4999C16.0003 11.7209 15.9125 11.9329 15.7562 12.0891C15.5999 12.2454 15.388 12.3332 15.1669 12.3332C14.9459 12.3332 14.734 12.2454 14.5777 12.0891C14.4214 11.9329 14.3336 11.7209 14.3336 11.4999H16.0003ZM5.41111 9.58906L1.24444 5.42239L2.42277 4.24406L6.58944 8.41073L5.41111 9.58906ZM1.24444 4.24406L5.41111 0.0773926L6.58944 1.25573L2.42277 5.42239L1.24444 4.24406ZM1.83361 3.99989H10.1669V5.66656H1.83361V3.99989ZM16.0003 9.83323V11.4999H14.3336V9.83323H16.0003ZM10.1669 3.99989C11.714 3.99989 13.1978 4.61447 14.2917 5.70844C15.3857 6.8024 16.0003 8.28613 16.0003 9.83323H14.3336C14.3336 8.72816 13.8946 7.66835 13.1132 6.88695C12.3318 6.10555 11.272 5.66656 10.1669 5.66656V3.99989Z" fill="url(#paint0_linear_1_1317)" />
          <defs>
            <linearGradient id="paint0_linear_1_1317" x1="8.32777" y1="0.0773926" x2="8.32777" y2="12.3332" gradientUnits="userSpaceOnUse">
              <stop stop-color="#8266D4" />
              <stop offset="1" stop-color="#41288A" />
            </linearGradient>
          </defs>
        </svg>

        <span>{previousLabel}</span>
      </button>
      <div />


      <button
        onClick={onNext}
        className="px-8 py-3 w-64 rounded-[10px] bg-gradient-to-b from-[#8266D4] to-[#41288A] shadow-card text-white font-medium flex items-center justify-center space-x-3"
      >
        <span>{nextLabel}</span>
        {
          nextLabel === 'Next' && (
            <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M11.9997 5.4999C11.9956 5.06148 11.819 4.64231 11.508 4.33323L7.93301 0.749896C7.77687 0.594687 7.56566 0.507568 7.34551 0.507568C7.12535 0.507568 6.91414 0.594687 6.75801 0.749896C6.6799 0.827365 6.61791 0.919532 6.5756 1.02108C6.53329 1.12263 6.51151 1.23155 6.51151 1.34156C6.51151 1.45157 6.53329 1.56049 6.5756 1.66204C6.61791 1.76359 6.6799 1.85576 6.75801 1.93323L9.49968 4.66656H1.16634C0.945327 4.66656 0.733366 4.75436 0.577086 4.91064C0.420805 5.06692 0.333008 5.27888 0.333008 5.4999C0.333008 5.72091 0.420805 5.93287 0.577086 6.08915C0.733366 6.24543 0.945327 6.33323 1.16634 6.33323H9.49968L6.75801 9.0749C6.60109 9.23071 6.51249 9.44248 6.51171 9.66362C6.51093 9.88475 6.59803 10.0971 6.75384 10.2541C6.90966 10.411 7.12143 10.4996 7.34256 10.5004C7.5637 10.5011 7.77609 10.414 7.93301 10.2582L11.508 6.6749C11.821 6.36377 11.9978 5.94121 11.9997 5.4999Z" fill="white" />
            </svg>
          )
        }
      </button>
    </div>
  );
};

export default StepNavigation;
