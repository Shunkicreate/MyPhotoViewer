import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";
import { useState, useEffect } from "react";
import sharp from "sharp";

export const loader = async ({ params }: { params: { year: string; month: string } }) => {
	const { year, month } = params;
	const monthPath = path.join("\\\\raspberrypi\\Main\\Photos", year, month);
	console.log(monthPath);
	const files = fs
		.readdirSync(monthPath)
		.filter(
			(file) =>
				file.toLowerCase().endsWith(".jpg") ||
				file.toLowerCase().endsWith(".jpeg") ||
				file.toLowerCase().endsWith(".png") ||
				file.toLowerCase().endsWith(".gif")
		);
	// 画像のリサイズとBase64エンコード
	const images = await Promise.all(
		files.map(async (file) => {
			const filePath = path.join(monthPath, file);
			console.log(filePath);
			const fileBuffer = fs.readFileSync(filePath);

			// 画像のリサイズと圧縮
			const resizedImageBuffer = await sharp(fileBuffer)
				.resize(480) // 幅を800ピクセルにリサイズ
				.jpeg({ quality: 70 }) // JPEGフォーマットに変換し、画質を70に設定
				.toBuffer();

			return resizedImageBuffer.toString("base64");
		})
	);

	return json({ year, month, files, images });
};

export default function Month() {
	const { year, month, files, images } = useLoaderData<{
		year: string;
		month: string;
		files: string[];
		images: string[];
	}>();
	const [loadedImages, setLoadedImages] = useState<string[]>([]);
	const [hasMore, setHasMore] = useState(true);

	useEffect(() => {
		const handleScroll = () => {
			if (
				window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight ||
				!hasMore
			) {
				return;
			}
			const loadImages = async () => {
				if (loadedImages.length >= files.length) {
					setHasMore(false);
					return;
				}

				const newImages = files.slice(loadedImages.length, loadedImages.length + 10).map((file) => {
					const filePath = path.join("\\\\raspberrypi\\Main\\Photos", year, month, file);
					const fileBuffer = fs.readFileSync(filePath);
					return fileBuffer.toString("base64");
				});

				setLoadedImages((prev) => [...prev, ...newImages]);
			};

			loadImages();
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [loadedImages, files, year, month, hasMore]);

	return (
		<div className='font-sans p-4'>
			<h1 className='text-3xl'>
				Photos of {month} {year}
			</h1>
			<div className='mt-4 grid grid-cols-3 gap-4'>
				{files.map((file, i) => (
					<div key={i} className='border p-2'>
						<img src={`data:image/jpeg;base64,${images[i]}`} alt={file} className='w-full h-auto' />
					</div>
				))}
			</div>
			{!hasMore && <div className='text-center mt-4'>No more images</div>}
		</div>
	);
}

