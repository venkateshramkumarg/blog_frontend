import React from 'react';

function ShimmerPost() {
    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Header */}
            <div className="bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5 animate-pulse">
                <div className="flex justify-between items-center border-b border-gray-400 pb-4 mb-4">
                    <div className="flex items-center w-36 justify-start gap-3">
                        <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                        <div className="flex-1">
                            <div className="bg-gray-300 w-32 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 w-24 h-4 rounded"></div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-300 w-24 h-4 rounded"></div>
                    </div>
                </div>
                <h2 className="bg-gray-300 w-3/4 h-6 rounded mb-4"></h2>
                <div className="bg-gray-300 w-full h-4 rounded mb-4"></div>
                <div className="bg-gray-300 w-full h-4 rounded mb-4"></div>
                <div className="bg-gray-300 w-full h-4 rounded mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="flex gap-3 items-center">
                        <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                        <div className="bg-gray-300 w-8 h-8 rounded-full"></div>
                    </div>
                    <div className="bg-gray-300 w-24 h-4 rounded"></div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5 animate-pulse">
                <h2 className="bg-gray-300 w-1/3 h-6 rounded mb-5"></h2>
                <div className="mb-5">
                    <div className="bg-gray-300 w-full h-12 rounded-md"></div>
                    <div className="bg-gray-300 w-full h-12 rounded-md mt-4"></div>
                    <div className="bg-gray-300 w-full h-12 rounded-md mt-4"></div>
                </div>
                <div className="bg-gray-300 w-full h-12 rounded-md"></div>
            </div>

            {/* Single Comment Placeholder */}
            <div className="bg-white p-4 border border-gray-300 shadow-md rounded-md mb-5 animate-pulse">
                <div className="flex justify-between mb-2 items-center">
                    <div className="flex items-center gap-3">
                        <div className="bg-gray-300 w-12 h-12 rounded-full"></div>
                        <div className="flex-1">
                            <div className="bg-gray-300 w-32 h-4 rounded mb-2"></div>
                            <div className="bg-gray-300 w-24 h-4 rounded"></div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-gray-300 w-24 h-4 rounded"></div>
                    </div>
                </div>
                <div className="bg-gray-300 w-full h-4 rounded"></div>
            </div>
        </div>
    );
}

export default ShimmerPost;
