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
            cancel_url: `${origin}/plans?canceled=true`,
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