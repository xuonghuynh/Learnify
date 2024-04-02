import { headers } from "next/headers";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        )
    } catch (error: any) {
        console.log(error)
        return new NextResponse(`Webhook error: ${error.message}`, { status: 400 })
    }

    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session?.metadata?.userId;
    const courseId = session?.metadata?.courseId;

    if(event.type === "checkout.session.completed") {   
        if(!userId || !courseId) {
            return new NextResponse("Missing userId or courseId", { status: 400 })
        }

        await db.purchase.create({
            data: {
                userId,
                courseId
            }
        })
    } else {
        return new NextResponse(`Unhandled event type: ${event.type}`, { status: 200 })
    }
    return new NextResponse(null, { status: 200 })
}