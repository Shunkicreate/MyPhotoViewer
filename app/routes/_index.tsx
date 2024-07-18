import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

const NAS_PATH = "\\\\raspberrypi\\Main\\Photos\\2007\\09_00";

export const loader = async () => {
  const files = fs
    .readdirSync(NAS_PATH)
    .filter(
      (file) =>
        file.toLowerCase().endsWith(".jpg") ||
        file.toLowerCase().endsWith(".jpeg") ||
        file.toLowerCase().endsWith(".png") ||
        file.toLowerCase().endsWith(".gif")
    );

  // Base64 エンコードされた画像データを取得
  const images = files.map((file) => {
    const filePath = path.join(NAS_PATH, file);
    const fileBuffer = fs.readFileSync(filePath);
    return fileBuffer.toString("base64");
  });

  return json({ files, images });
};

export default function Index() {
  const { files, images } = useLoaderData<{ files: string[]; images: string[] }>();

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Photo Viewer</h1>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {images.map((image, index) => (
          <div key={files[index]} className="border p-2">
            <img
              src={`data:image/jpeg;base64,${image}`}
              alt={files[index]}
              className="w-full h-auto"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
