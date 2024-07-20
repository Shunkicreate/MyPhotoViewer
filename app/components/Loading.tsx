const Loading = () => {
	return (
		<div className='fixed top-0 left-0 w-full h-full flex justify-center items-center'>
			<div className='absolute bg-gray-500 opacity-75 w-full h-full'></div>
			<img src='/ShakeMaracas.jpg' alt='マラカスを振っている画像' className='w-32 h-32 relative z-10 animate-tilt' />
		</div>
	);
};

export default Loading;

