import React, { useState } from 'react';

export interface YearListProps {
    selectedYear: number;
    years: number[];
}

const YearList: React.FC<YearListProps> = ({ selectedYear, years }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div className="relative inline-block text-left my-auto">
            <div>
                <button
                    type="button"
                    onClick={toggleDropdown}
                    className="flex items-center justify-between w-full px-8 py-2 text-xl text-gray-700 bg-bg-color rounded-lg shadow-outer-common focus:outline-none"
                >
                    {selectedYear}
                    <img
                        src="/keyboard_arrow_down.svg"
                        alt="Down Arrow"
                        className="w-6 h-6 ml-2"
                    />
                </button>
            </div>

            {isOpen && (
                <div className='absolute z-10 mt-2 w-full bg-bg-color rounded-lg shadow-outer-common'>
                    <ul>
                        {years.map((year) => (
                            <li key={year}>
                                <a
                                    href={`/${year}`}
                                    className={`block px-4 py-2 w-full text-center text-xl text-text-color bg-bg-color hover:bg-text-color hover:text-bg-color rounded-lg ${
                                        year === selectedYear ? 'bg-gray-400 text-white' : ''
                                    }`}
                                    onClick={() => setIsOpen(false)}
                                >
                                    {year}
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default YearList;
