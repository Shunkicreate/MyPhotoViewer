import { json, Links, Meta, Outlet, Scripts, ScrollRestoration, useLoaderData } from "@remix-run/react";
import "./tailwind.css";
import Header from "./components/Header";
import { TextFieldProps } from "./components/TextField";
import { YearListProps } from "./components/YearList";
import { useEffect, useState } from "react";
import useLocalStorage from "./hooks/useLocalStorage ";

const isAuthorized = (request: Request) => {
	const authHeader = request.headers.get("Authorization");
	const validUsername = process.env.BASIC_AUTH_USERNAME || "yourUsername";
	const validPassword = process.env.BASIC_AUTH_PASSWORD || "yourPassword";
	if (!authHeader || !authHeader.startsWith("Basic ")) {
		// 認証がない場合は401エラーを返す
		return false;
	}

	// 認証情報を解析
	const base64Credentials = authHeader.split(" ")[1];
	const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
	const [username, password] = credentials.split(":");
	if (username !== validUsername || password !== validPassword) {
		// 認証失敗時
		return false;
	}
	return true;
};

export const loader = ({ request }: { request: Request }) => {
	if (isAuthorized(request)) {
		return json({ authorized: true });
	} else {
		return new Response(JSON.stringify({ authorized: false }), {
			status: 401,
			headers: {
				"Content-Type": "application/json",
				"WWW-Authenticate": 'Basic realm="Access to the site"',
			},
		});
	}
};

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
			<head title='My Photo Viewer'>
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
	const { authorized } = useLoaderData<typeof loader>();
	if (!authorized) {
		return <>Authorization Required</>;
	}

	return <Outlet />;
}
