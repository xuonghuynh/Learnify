import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { currentUser } from "@clerk/nextjs";
import { url } from "inspector";
import { NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(request: Request, { params }: { params: { courseId: string } }) { 
    try {
        const user = await currentUser();

        if(!user || !user.emailAddresses?.[0]?.emailAddress || !user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                isPublished: true
            }
        });

        const purchase = await db.purchase.findUnique({
            where: {
                userId_courseId: {
                    userId: user.id,
                    courseId: params.courseId
                }
            }
        })

        if(purchase) {
            return new NextResponse("Already purchased", { status: 400 });
        }

        if(!course) {
            return new NextResponse("Course not found", { status: 404 });
        }

        const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: course.title,
                        description: course.description!
                    },
                    unit_amount: Math.round(course.price! * 100)
                },
                quantity: 1
            }
        ]

        let stripeCustomer = await db.stripeCustomer.findUnique({
            where: {
                userId: user.id
            }, 
            select: {
                stripeCustomerId: true
            }
        })

        if(!stripeCustomer) {
            const customer = await stripe.customers.create({
                email: user.emailAddresses[0].emailAddress,
            })
            stripeCustomer = await db.stripeCustomer.create({
                data: {
                    userId: user.id,
                    stripeCustomerId: customer.id
                    
                }
            })
        }

        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            line_items,
            success_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?success=1`,
            cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/courses/${course.id}?cancel=1`,
            metadata: {
                courseId: course.id,
                userId: user.id
            },
            customer: stripeCustomer.stripeCustomerId
        })

        return NextResponse.json({url: session.url});

    } catch (error) {
        console.log("[COURSE_ID_CHECKOUT] Error: ", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}