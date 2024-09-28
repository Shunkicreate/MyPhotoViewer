import { json, ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { useState, useEffect } from "react";
import Loading from "~/components/Loading";

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
	console.log(files);
	return json({ year, month, files, totalFiles: files.length });
};

export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const year = formData.get("year") as string;
	const month = formData.get("month") as string;
	const files = formData.getAll("file") as string[]; // 複数のファイルを取得
	const images = await Promise.all(
		files.map(async (file) => {
			try {
				const filePath = path.join("\\\\raspberrypi\\Main\\Photos", year, month, file);
				const fileBuffer = fs.readFileSync(filePath);
				const resizedImageBuffer = await sharp(fileBuffer).resize(480).jpeg({ quality: 70 }).toBuffer();
				return resizedImageBuffer.toString("base64");
			} catch (error) {
				console.error("Error processing image:", error);
				return null;
			}
		})
	);
	const notNullImages = images.filter((image) => image !== null) as string[];

	return json({ files, images: notNullImages });
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
			// 10個のファイルを一度にリクエスト
			const nextFiles = files.slice(loadedFiles.length, loadedFiles.length + 10);
			const formData = new FormData();
			formData.append("year", year);
			formData.append("month", month);
			nextFiles.forEach((file) => formData.append("file", file));
			fetcher.submit(formData, { method: "post", action: `/${year}/${month}` });
		};
		const intervalId = setInterval(loadImages, 200); // 1秒ごとに追加画像を取得
		return () => clearInterval(intervalId); // クリーンアップ
	}, [files, loadedFiles, totalFiles, year, month, hasMore, fetcher]);

	// fetcher.dataの処理を更新
	useEffect(() => {
		if (fetcher.data?.files && fetcher.data?.images) {
			setLoadedFiles((prev) => [...prev, ...fetcher.data.files]);
			setLoadedImages((prev) => [...prev, ...fetcher.data.images]);
		}
	}, [fetcher.data]);

	return (
		<div className='font-sans p-4'>
			{loadedImages.length === 0 && <Loading />}
			<h1 className='text-3xl'>
				Photos of {month} {year}
			</h1>
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{loadedImages.map((image, i) => (
					<div key={i} className='p-2'>
						<a href={`/${year}/${month}/${loadedFiles[i]}`}>
							<img src={`data:image/jpeg;base64,${image}`} alt={loadedFiles[i]} className='w-full h-auto' />
						</a>
					</div>
				))}
			</div>
			{!hasMore && <div className='text-center mt-4'>No more images</div>}
		</div>
	);
}
