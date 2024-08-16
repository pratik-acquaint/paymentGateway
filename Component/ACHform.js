import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import { useState } from 'react';
import { Button } from '@mui/material';
import PaidIcon from '@mui/icons-material/Paid';
import axios from 'axios';


const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

const ACHForm = () => {
    const APIURL = process.env.NEXT_PUBLIC_API_BASE_URL;
    console.log('APIURL', APIURL)
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!stripe || !elements) {
            console.error("Stripe has not loaded yet.");
            return;
        }

        setLoading(true);
        try {
            // Fetch the client secret from your backend using Axios
            const response = await axios.post(`${APIURL}/ach_payment`, {
                amount: 1000,
                customerEmail: 'pratik.bhandari@acquaintsoft.com' || '', // Replace with actual customer email
            });

            const { clientSecret } = response?.data;

            if (!clientSecret) {
                console.error('Failed to retrieve client secret');
                setLoading(false);
                return;
            }

            const { error } = await stripe.confirmUsBankAccountPayment(clientSecret, {
                elements,
                confirmParams: {
                    return_url: `${window.location.origin}/dashboard`,
                },
            });

            if (error) {
                console.error('Error:', error);
                setLoading(false);
                return;
            }
            console.log('Payment successful');

        } catch (error) {
            console.error('Error===>>>>>>>>>>>>>>>>>>', error);
        }
        finally {
            setLoading(false)
        }
    };


    return (
        <div onClick={handleSubmit}>
            <IbanElement />
            <Button
                type="button"
                disabled={!stripe || loading}
                variant="contained"
                startIcon={<PaidIcon />}
                style={{ margin: '7px 0px 7px' }}
            >
                {loading ? 'Processing...' : 'Pay with ACH'}
            </Button>
        </div>
    );
};

const ACHPayment = () => (
    <Elements stripe={stripePromise}>
        <ACHForm />
    </Elements>
);

export default ACHPayment;
