import { json, ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { useLoaderData } from "@remix-run/react";
import Loading from "~/components/Loading";
import { useBatchImageLoader } from "~/hooks/useBatchImageLoader";

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
	return json({ year, month, files, totalFiles: files.length }, { headers: { "Cache-Control": "public, max-age=600" } });
};

// action関数でエラーハンドリングを強化
export const action: ActionFunction = async ({ request }) => {
	const formData = await request.formData();
	const year = formData.get("year") as string;
	const month = formData.get("month") as string;
	const files = formData.getAll("file") as string[]; // 複数のファイルを取得

	try {
		const images = await Promise.all(
			files.map(async (file) => {
				try {
					const filePath = path.join("\\\\raspberrypi\\Main\\Photos", year, month, file);
					const fileBuffer = fs.readFileSync(filePath);
					const resizedImageBuffer = await sharp(fileBuffer).rotate().resize(480).jpeg({ quality: 70 }).toBuffer();
					return resizedImageBuffer.toString("base64");
				} catch (error) {
					console.error("Error processing image:", error);
					return null;
				}
			})
		);
		return json({ files, images });
	} catch (error) {
		console.error("Error in action:", error);
		return json({ error: "Error processing images" }, { status: 500 });
	}
};

interface LoaderData {
	year: string;
	month: string;
	files: string[];
	totalFiles: number;
}

export default function Month() {
	const { year, month, files, totalFiles } = useLoaderData<LoaderData>();
	const { loadedFiles, loadedImages, hasMore } = useBatchImageLoader({
		files,
		totalFiles,
		year,
		month,
		batchSize: 10, // 必要に応じて変更可能
	});

	return (
		<div className='p-4'>
			{loadedImages.length === 0 && <Loading />}
			<h1 className='text-3xl'>
				Photos of {month} {year}
			</h1>
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{loadedImages.map((image, i) => (
					<div key={i} className='p-2'>
						<a href={`/${year}/${month}/${loadedFiles[i]}`} target="_blank" rel="noreferrer">
							{image ? (
								<img src={`data:image/jpeg;base64,${image}`} alt={loadedFiles[i]} className='w-full h-auto' />
							) : (
								// 画像がない場合、altテキストを表示
								<div className='w-full h-48 flex items-center justify-center bg-gray-200 text-gray-700'>
									{loadedFiles[i]}
								</div>
							)}
						</a>
					</div>
				))}
			</div>
			{!hasMore && <div className='text-center mt-4'>No more images</div>}
		</div>
	);
}
