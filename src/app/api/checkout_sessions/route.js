import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe, PLAN_PRICE_ID } from '@/lib/stripe'
import { getUserSession } from '@/lib/core/session'

export async function POST(request) {
    try {
        const headersList = await headers()
        const origin = headersList.get('origin')

        let planId = 'user_premium';
        const contentType = request.headers.get('content-type') || '';
        
        if (contentType.includes('application/json')) {
            const body = await request.json().catch(() => ({}));
            planId = body.plan_id || 'user_premium';
        } else {
            const formData = await request.formData().catch(() => null);
            if (formData) {
                planId = formData.get('plan_id') || 'user_premium';
            }
        }

        const priceId = PLAN_PRICE_ID[planId];
        if (!priceId) {
            return NextResponse.json({ error: `Invalid plan ID: ${planId}` }, { status: 400 });
        }

        const user = await getUserSession();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized. Please sign in.' }, { status: 401 });
        }

        // Create Checkout Sessions from body params.
        const session = await stripe.checkout.sessions.create({
            customer_email: user?.email,
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'payment',
            metadata: {
                planId,
                userId: user.id,
                email: user.email,
            },
            success_url: `${origin}/plans/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/payment/cancel`,
        });


        if (contentType.includes('application/json')) {
            return NextResponse.json({ id: session.id, url: session.url });
        } else {
            return NextResponse.redirect(session.url, 303);
        }
    } catch (err) {
        console.error("Error creating stripe session:", err);
        return NextResponse.json(
            { error: err.message },
            { status: err.statusCode || 500 }
        )
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const sessionId = searchParams.get('session_id');

        if (!sessionId) {
            return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
        }

        // Retrieve Stripe session
        const session = await stripe.checkout.sessions.retrieve(sessionId);
        if (!session) {
            return NextResponse.json({ error: 'Session not found' }, { status: 404 });
        }

        if (session.payment_status === 'paid') {
            const metadata = session.metadata;
            const planId = metadata?.planId || 'user_premium';
            const email = metadata?.email || session.customer_email;
            const userId = metadata?.userId;

            if (email || userId) {
                const { MongoClient } = await import('mongodb');
                const client = new MongoClient(process.env.AUTH_DB_URI);
                await client.connect();
                const dbName = process.env.AUTH_DB_URI.split('/').pop().split('?')[0] || 'lexmora_db';
                const db = client.db(dbName);
                const usersCollection = db.collection('user');

                let user = null;
                if (userId) {
                    user = await usersCollection.findOne({
                        $or: [
                            { id: userId },
                            { email: email }
                        ]
                    });
                } else if (email) {
                    user = await usersCollection.findOne({ email: email });
                }

                if (user) {
                    await usersCollection.updateOne(
                        { _id: user._id },
                        { $set: { plan: planId, isPremium: planId === 'user_premium' } }
                    );

                    // Insert subscription record if not present
                    const subscriptionsCollection = db.collection('subscriptions');
                    const existingSub = await subscriptionsCollection.findOne({ sessionId: sessionId });
                    if (!existingSub) {
                        await subscriptionsCollection.insertOne({
                            userId: user.id || user._id.toString(),
                            email: user.email,
                            planId: planId,
                            sessionId: sessionId,
                            amount: session.amount_total ? session.amount_total / 100 : 1500,
                            status: 'active',
                            createdAt: new Date()
                        });
                    }

                    await client.close();
                    return NextResponse.json({ success: true, plan: planId });
                } else {
                    await client.close();
                    return NextResponse.json({ error: 'User not found in database for upgrade' }, { status: 404 });
                }
            }
        }

        return NextResponse.json({ success: false, status: session.payment_status });
    } catch (err) {
        console.error('Error verifying Stripe session:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}