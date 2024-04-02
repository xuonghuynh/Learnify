'use client';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { formatPrice } from "@/lib/format";
import axios from "axios";
import React from "react";

const CourseEnrollButton = ({
    courseId,
    price,
}: {
    courseId: string;
    price: number;
}) => {
    const [isLoading, setIsLoading] = React.useState(false);
    const onClick = async () => {
        console.log('object')
        try {
            setIsLoading(true);
            const res = await axios.post(`/api/courses/${courseId}/checkout`)
            console.log(res)
            window.location.assign(res.data.url)
        } catch (error) {
            console.log(error)
            toast({
                title: "Something went wrong!",
                variant: "destructive",
                duration: 2000,
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Button onClick={onClick} disabled={isLoading} className="w-full md:w-auto" size={"sm"}>
            Enroll for {formatPrice(price)}
        </Button>
    );
};

export default CourseEnrollButton;
