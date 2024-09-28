import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";

const NAS_PATH = "\\\\raspberrypi\\Main\\Photos";

export const loader = async () => {
	const folders = fs
		.readdirSync(NAS_PATH, { withFileTypes: true })
		.filter((dirent) => dirent.isDirectory())
		.map((dirent) => dirent.name);

	return json({ folders });
};

export default function Index() {
	const { folders } = useLoaderData<{ folders: string[] }>();

	return (
		<div className='p-4'>
			<h1 className='text-3xl'>Photo Viewer</h1>
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{folders.map((folder) => (
					<a key={folder} href={`/${folder}`} className='block mt-2'>
						{folder}
					</a>
				))}
			</div>
		</div>
	);
}
