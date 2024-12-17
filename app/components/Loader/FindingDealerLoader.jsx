import React from 'react';

const FindingDealerLoader = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col items-center space-y-6 animate-fade-in">
                
                {/* Spinner Loader */}
                <div className="w-16 h-16 border-4 border-gray-300 border-t-4 border-t-blue-500 rounded-full animate-spin"></div>

                {/* Text Information */}
                <div className="text-2xl font-bold text-gray-800">Locating the Best Dealer for You...</div>
                <p className="text-gray-500 text-center">
                    Please wait a moment while we find the nearest available dealer. This process might take a few seconds.
                </p>
            </div>
        </div>
    );
};

export default FindingDealerLoader;
