import React from "react";
import TextField, { TextFieldProps } from "./TextField";
import YearList, { YearListProps } from "./YearList";
import { Link } from "@remix-run/react";

interface HeaderProps {
	yearListProps: YearListProps;
	textFieldProps: TextFieldProps;
}

const Header: React.FC<HeaderProps> = ({ yearListProps, textFieldProps }) => {
	return (
		<header
			className={`header flex flex-wrap justify-between items-center w-full shadow-outer-common sticky top-0 z-50 transition-colors duration-300 bg-bg-color`}
		>
			<Link to='/' className='header-title text-4xl font-normal ml-12 py-2'>
				My Photos
			</Link>
			<div className='header-right flex mr-24'>
				<div className='mx-12 my-auto'>
					<YearList {...yearListProps} />
				</div>
				<div className='my-auto'>
					<TextField {...textFieldProps} />
				</div>
			</div>
		</header>
	);
};

export default Header;

