import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";
import MonthLink from "~/components/MonthLink";
import load_nas_path from "~/lib/load_nas_path";

// 月名の対応表を作成
const monthNames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
];

export const loader = async ({ params }: { params: { year: string } }) => {
	const { year } = params;
	const NAS_PATH = load_nas_path();
	const yearPath = path.join(NAS_PATH, year);
	const months = fs.readdirSync(yearPath).filter((month) => fs.statSync(path.join(yearPath, month)).isDirectory());

	return json({ year, months }, { headers: { "Cache-Control": "public, max-age=600" } });
};

export default function Year() {
	const { year, months } = useLoaderData<{ year: string; months: string[] }>();

	// 月ごとのフォルダをまとめるためのオブジェクト
	const monthFolders: { [key: string]: string[] } = {};

	// 月ごとにフォルダを分類
	months.forEach((month) => {
		const [monthNumber, folderNumber] = month.split("_");
		const monthName = monthNames[parseInt(monthNumber, 10) - 1];

		if (!monthFolders[monthName]) {
			monthFolders[monthName] = [];
		}

		monthFolders[monthName].push(folderNumber);
	});

	return (
		<div className='p-4'>
			<h1 className='text-3xl text-center'>Photos of {year}</h1>
			<div className='mt-4 mx-auto max-w-4xl'>
				<ul>
					{Object.entries(monthFolders).map(([monthName, folderNumbers]) => (
						<li key={monthName} className='mb-4'>
							<h2 className='text-2xl'>{monthName}</h2>
							<ul className='ml-4'>
								{folderNumbers.map((folderNumber, index) => (
									<MonthLink
										key={index}
										month={`No.${parseInt(folderNumber, 10) + 1}`}
										to={`/${year}/${monthNames.indexOf(monthName) + 1}_${folderNumber}`}
									/>
								))}
							</ul>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
