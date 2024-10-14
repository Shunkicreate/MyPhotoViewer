import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "@remix-run/react";
import "./tailwind.css";
import Header from "./components/Header";
import { TextFieldProps } from "./components/TextField";
import { YearListProps } from "./components/YearList";
import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage ";

export function Layout({ children }: { children: React.ReactNode }) {
	const [selectedYear, setSelectedYear] = useLocalStorage<number>("selectedYear", 2017);
	const [yearList, setYearList] = useState<number[]>([]);

	useEffect(() => {
		const fetchFolders = async () => {
			const response = await fetch("/api/folders");
			const data = await response.json();
			const years = data.folders
				.map((folder: string) => parseInt(folder, 10))
				.filter((year: number) => !isNaN(year))
				.sort((a: number, b: number) => b - a);

			setYearList(years);
			// setSelectedYear(years[0] || 2024);
		};

		fetchFolders();
	}, []);

	const yearListProps: YearListProps = {
		selectedYear,
		years: yearList,
		setSelectedYear,
	};

	const textFieldProps: TextFieldProps = {
		value: "",
		onChange: () => {},
	};

	return (
		<html lang='ja'>
			<head>
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<Meta />
				<Links />
			</head>
			<body className='font-noto-sans-jp text-text-color bg-bg-color'>
				<Header yearListProps={yearListProps} textFieldProps={textFieldProps} />
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}
