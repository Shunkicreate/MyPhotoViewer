import { Link } from "@remix-run/react";

interface MonthLinkProps {
	month: string;
	to: string;
}

const MonthLink: React.FC<MonthLinkProps> = ({ month, to }: MonthLinkProps) => {
	// `to` から `/年/月_番号` の形式を取り出す
	const parts = to.split("/");
	const year = parts[1];
	const monthPart = parts[2].split("_")[0]; // 月の部分を取得
	const folderNumber = parts[2].split("_")[1]; // 番号部分を取得

	// 月を2桁にゼロ埋め
	const formattedMonth = monthPart.padStart(2, "0");

	// フォーマットされたパスを再構築
	const formattedTo = `/${year}/${formattedMonth}_${folderNumber}`;

	return (
		<li>
			<Link
				to={`${formattedTo}`}
				className={`block px-4 py-2 w-full text-center text-xl text-text-color bg-bg-color hover:bg-text-color hover:text-bg-color rounded-lg`}
			>
				{month}
			</Link>
		</li>
	);
};

export default MonthLink;

