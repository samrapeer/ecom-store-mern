import React, { useContext, useEffect, useState } from 'react';
import SummaryApi from '../common';
import Context from '../context';
import displayINRCurrency from '../helpers/displayCurrency';
import { MdDelete } from "react-icons/md";
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const Cart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [paymentLoading, setPaymentLoading] = useState(false); // New loading state for payment
    const context = useContext(Context);
    const loadingCart = new Array(4).fill(null);

    const fetchData = async () => {
        const response = await fetch(SummaryApi.addToCartProductView.url, {
            method: SummaryApi.addToCartProductView.method,
            credentials: 'include',
            headers: {
                "content-type": 'application/json'
            },
        });

        const responseData = await response.json();

        if (responseData.success) {
            setData(responseData.data);
        }
    };

    const handleLoading = async () => {
        await fetchData();
    };

    useEffect(() => {
        setLoading(true);
        handleLoading();
        setLoading(false);
    }, []);

    const handlePayment = async () => {
        setPaymentLoading(true); // Start the spinner

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: totalCPrice }), // Send amount in paisa
            });

            const { id } = await response.json();

            const stripe = await stripePromise;
            const { error } = await stripe.redirectToCheckout({ sessionId: id });

            if (error) {
                console.error("Error redirecting to Checkout:", error);
            }
        } catch (error) {
            console.error("Payment failed:", error);
        } finally {
            setPaymentLoading(false); // Stop the spinner
        }
    };

    const totalQty = data.reduce((previousValue, currentValue) => previousValue + currentValue.quantity, 0);
    const totalPrice = data.reduce((preve, curr) => preve + (curr.quantity * curr?.productId?.sellingPrice), 0);
    const totalCPrice = totalPrice * 100; // Amount in paisa

    return (
        <div className='container mx-auto'>
            <div className='text-center text-lg my-3'>
                {data.length === 0 && !loading && (
                    <p className='bg-white py-5'>No Data</p>
                )}
            </div>

            <div className='flex flex-col lg:flex-row gap-10 lg:justify-between p-4'>
                {/* View Product */}
                <div className='w-full max-w-3xl'>
                    {loading ? (
                        loadingCart.map((el, index) => (
                            <div
                                key={el + "Add To Cart Loading" + index}
                                className='w-full bg-slate-200 h-32 my-2 border border-slate-300 animate-pulse rounded'
                            ></div>
                        ))
                    ) : (
                        data.map((product) => (
                            <div
                                key={product?._id + "Add To Cart Loading"}
                                className='w-full bg-white h-32 my-2 border border-slate-300 rounded grid grid-cols-[128px,1fr]'
                            >
                                {/* Product Details */}
                                ...
                            </div>
                        ))
                    )}
                </div>

                {/* Summary */}
                <div className='mt-5 lg:mt-0 w-full max-w-sm'>
                    {loading ? (
                        <div className='h-36 bg-slate-200 border border-slate-300 animate-pulse'></div>
                    ) : (
                        <div className='h-36 bg-white'>
                            <h2 className='text-white bg-red-600 px-4 py-1'>Summary</h2>
                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Quantity</p>
                                <p>{totalQty}</p>
                            </div>

                            <div className='flex items-center justify-between px-4 gap-2 font-medium text-lg text-slate-600'>
                                <p>Total Price</p>
                                <p>{displayINRCurrency(totalPrice)}</p>
                            </div>

                            {/* Payment Button */}
                            <button
                                className='bg-blue-600 p-2 text-white w-full mt-2 flex items-center justify-center disabled:bg-blue-300 disabled:cursor-not-allowed'
                                onClick={handlePayment}
                                disabled={paymentLoading} // Disable button when loading
                            >
                                {paymentLoading ? (
                                    <svg
                                        className='w-5 h-5 text-white animate-spin'
                                        xmlns='http://www.w3.org/2000/svg'
                                        fill='none'
                                        viewBox='0 0 24 24'
                                    >
                                        <circle
                                            className='opacity-25'
                                            cx='12'
                                            cy='12'
                                            r='10'
                                            stroke='currentColor'
                                            strokeWidth='4'
                                        ></circle>
                                        <path
                                            className='opacity-75'
                                            fill='currentColor'
                                            d='M4 12a8 8 0 018-8V0C6.477 0 2 4.477 2 10h2zm2 5.291A7.973 7.973 0 014 12H0c0 2.042.632 3.938 1.709 5.291l1.682-1.682z'
                                        ></path>
                                    </svg>
                                ) : (
                                    "Pay Now"
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Cart;
