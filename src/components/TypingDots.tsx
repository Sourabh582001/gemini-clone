"use client";
import { useEffect, useState } from "react";

export default function TypingDots() {
    const [dots, setDots] = useState(".");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "." : prev + "."));
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <span className="animate-pulse">Gemini is typing{dots}</span>
    );
}
