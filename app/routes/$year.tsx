import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const loader = async ({ params }: { params: { year: string } }) => {
	const { year } = params;
	const yearPath = path.join("\\\\raspberrypi\\Main\\Photos", year);
	const months = fs.readdirSync(yearPath).filter((month) => fs.statSync(path.join(yearPath, month)).isDirectory());

	return json({ year, months });
};
    
export default function Year() {
	const { year, months } = useLoaderData<{ year: string; months: string[] }>();

	return (
		<div className='font-sans p-4'>
			<h1 className='text-3xl'>Photos of {year}</h1>
			<div className='mt-4'>
				{months.map((month) => (
					<a key={month} href={`/${year}/${month}`} className='block mt-2'>
						{month}
					</a>
				))}
			</div>
		</div>
	);
}

