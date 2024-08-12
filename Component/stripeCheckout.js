import { Button } from '@mui/material';
import { loadStripe } from '@stripe/stripe-js';
import { useState } from 'react';
import PaidIcon from '@mui/icons-material/Paid';
import axios from 'axios';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const StripeCheckout = (props) => {
    const [loading, setLoading] = useState(false);
    const APIURL = process.env.NEXT_PUBLIC_API_BASE_URL
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
        // else {
          
        //     try {
        //         let token = localStorage.getItem('token')
        //         const headers = {
        //             'token': `${token}`,
        //         };
        //         let res = await axios.post(`${APIURL}/addPayment`, {
        //             headers: headers,
        //         })
        //         if (res?.data) {
        //             alert(res?.data?.message)
        //         }
        //         else {
        //             alert(res?.error?.data?.message)
        //         }
        //     }
        //     catch (error) {
        //         console.log(error);
        //     }
        // }
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
