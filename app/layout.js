// layout.js
'use client'
import React from 'react';
import Header from '@/Component/header';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { usePathname } from 'next/navigation';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);


const Layout = ({ children }) => {
    const pathname = usePathname();
    let unauthPage = ["/", "/signUp"].includes(pathname);
    return (
        <html lang="en">
            <body>
            {!unauthPage && <Header />} 
                <Elements stripe={stripePromise}>
                    {children}
                </Elements>
            </body>
        </html>
    );
}

export default Layout;
