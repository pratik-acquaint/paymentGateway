import { Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripeCheckout = (props) => {
    console.log('propssssssss', props)
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        setLoading(true);
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({
            lineItems: [{ price: 'price_1PlpqYKxM0bICH2VyjLBMpSk', quantity: 1 }],
            mode: 'payment',
            successUrl: `${window.location.origin}/dashboard`,
        });
        if (error) {
            console.error('Error:', error);
            setLoading(false);
            return;
        }

        // Call API to add current user to DB.
        // await addUser()
    };

    return (
        <Button
            onClick={handleClick}
            disabled={loading}
            type="button"
            variant="contained"
            startIcon={<PaidIcon />}
        >
            {loading ? 'Loading...' : ' Make Payment'}
        </Button>
    );
};

export default StripeCheckout;
