// layout.js
'use client'
import React from 'react';
import Header from '@/Component/header'; 
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const Layout = ({ children }) => {
    return (
        <html lang="en">
            <body>
                <Header />
                <Elements stripe={stripePromise}>
                    {children}
                </Elements>
            </body>
        </html>
    );
}

export default Layout;
