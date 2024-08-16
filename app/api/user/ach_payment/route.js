
import { NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

export default async function POST(request) {

  try {
    const { amount, customerEmail } = await request.json();

    console.log("amount, customerEmail", amount, customerEmail)

    // Create a new customer or fetch an existing one
    const customer = await stripe.customers.create({
      email: customerEmail,
    });

    console.log('customer created', customer)
    // Create a payment intent for ACH
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount, // amount in cents
      currency: 'usd',
      payment_method_types: ['us_bank_account'],
      customer: customer.id,
    });

    console.log('payment is created', paymentIntent)

    // Optionally, save the payment intent details in your database using Prisma
    await prisma.payments.create({
      data: {
        customerEmail,
        stripePaymentIntentId: paymentIntent.id,
        amount,
        status: paymentIntent.status,
      },
    });

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });

  } catch (error) {
    return new NextResponse(error.message || error, { status: 500 });
  }

}
