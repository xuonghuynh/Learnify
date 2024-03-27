"use client";

import ReactConfetti from "react-confetti";
import { useConfettiStore } from "@/hooks/use-confetti-store";

export default function ConfettiProvider() {
    const confetti = useConfettiStore();

    if (!confetti.isOpen) return null;

    return (
        <>
            <ReactConfetti
                className="pointer-events-none z-[100]"
                numberOfPieces={100}
                recycle={false}
                onConfettiComplete={() => confetti.onClose()}
            />
        </>
    );
}
