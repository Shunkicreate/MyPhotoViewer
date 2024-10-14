import { useLoaderData } from "@remix-run/react";
import fs from "fs";
import path from "path";

// Loader function to fetch image data from NAS
export const loader = async ({ params }: { params: { year: string; month: string; photoName: string } }) => {
    const { year, month, photoName } = params;
    const filePath = path.join("\\\\raspberrypi\\Main\\Photos", year, month, photoName);

    if (!fs.existsSync(filePath)) {
        throw new Response("File not found", { status: 404 });
    }

    const imageData = fs.readFileSync(filePath);
    return new Response(JSON.stringify({ imageData: imageData.toString('base64'), year, month }), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": "public, max-age=600",
        },
    });
};

interface LoaderData {
    imageData: string;
    year: string;
    month: string;
}

// Client-side component to render the image
export default function Photo() {
    const { imageData, year, month } = useLoaderData<LoaderData>();

    return (
        <div>
            <img src={`data:image/jpeg;base64,${imageData}`} alt={`${year}-${month}`} />
        </div>
    );
}