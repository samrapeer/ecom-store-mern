import React from 'react';
import { useSearchParams } from 'react-router-dom';

const Success = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');

    return (
        <div className="container mx-auto text-center p-10">
            <h1 className="text-4xl font-bold text-green-600">Payment Successful!</h1>
            <p className="text-lg mt-4">
                Thank you for your purchase. Your payment was successful.
            </p>
            {sessionId && (
                <p className="text-sm text-gray-500 mt-2">
                    Payment Session ID: <span className="font-mono">{sessionId}</span>
                </p>
            )}
            <button
                onClick={() => (window.location.href = '/')}
                className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                Back to Home
            </button>
        </div>
    );
};

export default Success;
