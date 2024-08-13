import { buffer } from 'micro';
import Stripe from 'stripe';
import prisma from '../../lib/prisma'; 

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY, {
    apiVersion: '2023-08-01',
});

export const config = {
    api: {
        bodyParser: false, // Stripe sends requests as raw text
    },
};

const webhookSecret = process.env.NEXT_PUBLIC_STRIPE_WEBHOOK_SECRET;

export default async function handler(req, res) {
    if (req.method == 'POST') {
        const buf = await buffer(req);
        const sig = req.headers['stripe-signature'];

        let event;
        try {
            event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
        } catch (err) {
            console.error(`Webhook Error: ${err.message}`);
            res.status(400).send(`Webhook Error: ${err.message}`);
            return;
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;

            // Save session details to your PostgreSQL database using Prisma
            try {
                await prisma.transaction.create({
                    data: {
                        transactionId: session.id,
                        customerEmail: session.customer_details?.email || '',
                        amountTotal: session.amount_total || 0,
                        currency: session.currency,
                        paymentStatus: session.payment_status,
                        createdAt: new Date(session.created * 1000),
                    },
                });
            } catch (err) {
                console.error('Error saving transaction:', err);
                res.status(500).send('Error saving transaction');
                return;
            }

            // Optionally, call another API or perform other tasks here
        }

        res.status(200).json({ received: true });
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
