import { Link } from "@remix-run/react";

interface YearLinkProps {
	year: string;
	isSelected: boolean;
	onClick: () => void;
}

const YearLink: React.FC<YearLinkProps> = ({ year, isSelected, onClick }: YearLinkProps) => {
	return (
		<li>
			<Link
				to={`/${year}`}
				className={`block px-4 py-2 w-full text-center text-xl text-text-color bg-bg-color hover:bg-text-color hover:text-bg-color rounded-lg ${
					isSelected ? "bg-gray-400 text-white" : ""
				}`}
				onClick={onClick}
			>
				{year}
			</Link>
		</li>
	);
};

export default YearLink;

