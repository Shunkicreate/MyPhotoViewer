import React from "react";
import TextField from "./TextField";
import YearList from "./YearList";
import { TextFieldProps } from "./TextField";
import { YearListProps } from "./YearList";

interface HeaderProps {
	yearListProps: YearListProps;
	textFieldProps: TextFieldProps;
}

const Header: React.FC<HeaderProps> = ({ yearListProps, textFieldProps }) => {
	return (
		<header className='header flex flex-wrap justify-between items-center w-full shadow-outer-common'>
			<a href='/' className='header-title text-4xl font-normal ml-12 py-2'>
				My Photos
			</a>
			<div className='header-right flex mr-24'>
				<div className="mx-12 my-auto">
					<YearList {...yearListProps} />
				</div>
				<div className="my-auto">
					<TextField {...textFieldProps} />
				</div>
			</div>
		</header>
	);
};

export default Header;
