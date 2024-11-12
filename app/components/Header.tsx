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
			<div className='flex my-2 sm:flex-row w-full justify-between items-center'>
				<Link to='/' className='header-title text-2xl sm:text-3xl md:text-4xl font-normal ml-4 sm:ml-8 md:ml-12 py-2'>
					My Photos
				</Link>
				<div className='flex flex-row items-center'>
					<div className='mx-4 sm:mx-8 md:mx-12 my-auto hidden sm:block'>
						<TextField {...textFieldProps} />
					</div>
					<div className='mx-4 sm:mx-8 md:mx-12 my-auto'>
						<YearList {...yearListProps} />
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;

