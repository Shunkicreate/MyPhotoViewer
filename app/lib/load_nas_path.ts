const load_nas_path: () => string = () => {
    let NAS_PATH = process.env.NAS_PATH || "";
    if (process.env.NODE_ENV === "development") {
		NAS_PATH = `\\\\${NAS_PATH}`;
	}
    return NAS_PATH;
};

export default load_nas_path;