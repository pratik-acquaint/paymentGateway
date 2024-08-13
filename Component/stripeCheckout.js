import { Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripeCheckout = () => {
    const [loading, setLoading] = useState(false);
    const handleClick = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: 'price_1PlpqYKxM0bICH2VyjLBMpSk', quantity: 1 }],
            mode: 'payment',
            successUrl: `${window.location.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
        });
        if (error) {
            console.error('Error:', error);
            setLoading(false);
            return;
        }
    };

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            type="button"
            variant="contained"
            startIcon={<PaidIcon />}
            style={{margin:'7px 0px 7px'}}
        >
            {loading ? 'Loading...' : ' Make Payment'}
        </Button>
    );
};

export default StripeCheckout;
