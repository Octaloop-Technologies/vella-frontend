  const FilterDropdown = ({
    isOpen,
    setIsOpen,
    value,
    setValue,
    options
  }: {
    isOpen: boolean;
    setIsOpen: (val: boolean) => void;
    value: string;
    setValue: (val: string) => void;
    options: string[];
  }) => (
    <div className="flex-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-5 py-3 border border-[#41288A80] bg-white rounded-lg text-sm font-medium text-[#1F2937] flex items-center justify-between"
      >
        <span className="text-base font-medium">{value}</span>
        <svg
          width="16"
          height="9"
          viewBox="0 0 16 9"
          fill="none"
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`}
        >
          <path d="M8.35413 5.54331C8.30768 5.58988 8.2525 5.62682 8.19176 5.65203C8.13101 5.67723 8.06589 5.69021 8.00013 5.69021C7.93436 5.69021 7.86924 5.67723 7.80849 5.65203C7.74775 5.62682 7.69257 5.58988 7.64613 5.54331L3.06113 0.957314C2.77986 0.675919 2.39834 0.51778 2.00048 0.517687C1.60262 0.517593 1.22102 0.675551 0.939627 0.956814C0.658232 1.23808 0.500094 1.6196 0.5 2.01746C0.499906 2.41532 0.657865 2.79692 0.939127 3.07831L5.52513 7.66431C6.18216 8.31955 7.07221 8.6875 8.00013 8.6875C8.92804 8.6875 9.81809 8.31955 10.4751 7.66431L15.0611 3.07831C15.3424 2.79692 15.5003 2.41532 15.5003 2.01746C15.5002 1.6196 15.342 1.23808 15.0606 0.956814C14.7792 0.675551 14.3976 0.517593 13.9998 0.517687C13.6019 0.51778 13.2204 0.675919 12.9391 0.957314L8.35413 5.54331Z" fill="black" />
        </svg>
      </button>

      {isOpen && (
        <div className="mt-2 bg-white border border-[#E5E7EB] rounded-lg shadow-lg">
          <div className="py-1">
            {options.map((option) => (
              <button
                key={option}
                onClick={() => {
                  setValue(option);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2.5 text-left text-sm hover:bg-[#F3F4F6] flex items-center justify-between ${value === option ? 'bg-[#EEF2FF]' : ''
                  }`}
              >
                <span className={value === option ? 'font-medium text-[#1F2937]' : 'text-[#6B7280]'}>
                  {option}
                </span>
                {value === option && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M13.3332 4L5.99984 11.3333L2.6665 8" stroke="#8266D4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  export default FilterDropdown;