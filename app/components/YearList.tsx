import { useEffect, useRef, useState } from "react";
import YearLink from "./YearLink";

export interface YearListProps {
	selectedYear: number | null;
	years: number[];
	setSelectedYear: (value: number) => void;
}

const YearDropdown: React.FC<YearListProps> = ({ selectedYear, years, setSelectedYear }: YearListProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	const toggleDropdown = () => setIsOpen(!isOpen);

	const handleClickOutside = (event: MouseEvent) => {
		if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
			setIsOpen(false);
		}
	};

	useEffect(() => {
		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		} else {
			document.removeEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	return (
		<div className='relative inline-block text-left my-auto' ref={dropdownRef}>
			<div>
				<button
					type='button'
					onClick={toggleDropdown}
					className='flex items-center justify-between w-full px-8 py-2 text-xl text-gray-700 bg-bg-color rounded-lg shadow-outer-common focus:outline-none'
				>
					{selectedYear}
					<img src='/keyboard_arrow_down.svg' alt='Down Arrow' className='w-6 h-6 ml-2' />
				</button>
			</div>

			{isOpen && (
				<div className='absolute z-10 mt-2 w-full bg-bg-color rounded-lg shadow-outer-common'>
					<ul>
						{years.map((year) => (
							<YearLink
								key={year}
								year={String(year)}
								isSelected={year === selectedYear}
								onClick={() => {
									setIsOpen(false);
									setSelectedYear(year);
								}}
							/>
						))}
					</ul>
				</div>
			)}
		</div>
	);
};

export default YearDropdown;

