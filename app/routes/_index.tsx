import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import YearLink from "~/components/YearLink";

export const loader = async () => {
	const NAS_PATH = process.env.NAS_PATH || ""
	const folders = fs
		.readdirSync(NAS_PATH, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);
		folders.sort((a, b) => b.localeCompare(a, undefined, { numeric: true }));

	return json({ folders }, { headers: { "Cache-Control": "public, max-age=600" } });
};

export default function Index() {
	const { folders } = useLoaderData<{ folders: string[] }>();

	return (
		<div className='p-4'>
			<h1 className='text-3xl'>Years</h1>
			<div>
				<ul className='mt-4 grid grid-cols-5 gap-8'>
					{folders.map((folder) => (
						<YearLink key={folder} year={folder} isSelected={false} onClick={() => {}} />
					))}
				</ul>
			</div>
		</div>
	);
}
