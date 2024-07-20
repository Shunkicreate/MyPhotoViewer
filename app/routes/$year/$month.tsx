import { json, ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";

export const loader = async ({ params }: { params: { year: string; month: string } }) => {
	const { year, month } = params;
	const monthPath = path.join("\\\\raspberrypi\\Main\\Photos", year, month);
	const files = fs
		.readdirSync(monthPath)
		.filter(
			(file) =>
				file.toLowerCase().endsWith(".jpg") ||
				file.toLowerCase().endsWith(".jpeg") ||
				file.toLowerCase().endsWith(".png") ||
				file.toLowerCase().endsWith(".gif")
		);

	return json({ year, month, files, totalFiles: files.length });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const year = formData.get("year") as string;
  const month = formData.get("month") as string;
  const file = formData.get("file") as string;
	const filePath = path.join("\\\\raspberrypi\\Main\\Photos", year, month, file);
	const fileBuffer = fs.readFileSync(filePath);

	const resizedImageBuffer = await sharp(fileBuffer).resize(480).jpeg({ quality: 70 }).toBuffer();

	return json({ file, image: resizedImageBuffer.toString("base64") });
};

interface LoaderData {
	year: string;
	month: string;
	files: string[];
	totalFiles: number;
}

export default function Month() {
	const { year, month, files, totalFiles } = useLoaderData<LoaderData>();
	const [loadedFiles, setLoadedFiles] = useState<string[]>([]);
	const [loadedImages, setLoadedImages] = useState<string[]>([]);
	const fetcher = useFetcher<typeof action>();
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		const loadImages = async () => {
			if (loadedFiles.length >= totalFiles) {
				setHasMore(false);
				return;
			}

      const file = files[loadedFiles.length];
      const formData = new FormData();
      formData.append("year", year);
      formData.append("month", month);
      formData.append("file", file);

      fetcher.submit(formData, { method: "post", action: `/${year}/${month}` });
    };

		const intervalId = setInterval(loadImages, 1000); // 1秒ごとに追加画像を取得

		return () => clearInterval(intervalId); // クリーンアップ
	}, [files, loadedFiles, totalFiles, year, month, hasMore, fetcher]);

	useEffect(() => {
		// Check if fetcher.data is defined before accessing its properties
		if (fetcher.data?.file && fetcher.data?.image) {
			setLoadedFiles((prev) => [...prev, fetcher.data.file]);
			setLoadedImages((prev) => [...prev, fetcher.data.image]);
		}
	}, [fetcher.data]);

	return (
		<div className='font-sans p-4'>
			<h1 className='text-3xl'>
				Photos of {month} {year}
			</h1>
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{loadedImages.map((image, i) => (
					<div key={i} className='border p-2'>
						<img src={`data:image/jpeg;base64,${image}`} alt={loadedFiles[i]} className='w-full h-auto' />
					</div>
				))}
			</div>
			{!hasMore && <div className='text-center mt-4'>No more images</div>}
		</div>
	);
}
