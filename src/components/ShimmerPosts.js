function ShimmerPosts() {
    return (
        <div className="max-w-md mx-auto mb-5 sm:max-w-2xl">
            {[...Array(5)].map((_, index) => (
                <div key={index} className="bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5 animate-pulse">
                    <div className="flex items-center justify-between border-b border-gray-200 pb-3 mb-2">
                        <div className="flex items-center gap-3">
                            <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                            <div className="flex-1">
                                <div className="bg-gray-300 w-32 h-4 rounded mb-2"></div>
                                <div className="bg-gray-300 w-24 h-4 rounded"></div>
                            </div>
                        </div>
                        <div className="bg-gray-300 w-24 h-4 rounded"></div>
                    </div>

                    {/* Title */}
                    <div className="mb-2">
                        <div className="bg-gray-300 w-3/4 h-6 rounded mb-2"></div>
                        <div className="bg-gray-300 w-full h-4 rounded mb-4"></div>
                    </div>

                    <div className="flex justify-between items-center border-t border-gray-200 pt-2 mt-4">
                        <div className="flex gap-3 items-center">
                            <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                            <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                        </div>
                        <div className="bg-gray-300 w-24 h-4 rounded"></div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default ShimmerPosts;
