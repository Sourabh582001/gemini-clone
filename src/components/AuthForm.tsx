"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import { fetchCountries } from "@/utils/fetchCountries";
import { useAuthStore } from "@/store/authStore";
import { useChatStore } from "@/store/chatStore";
import { useRouter } from "next/navigation";

// Schema for form validation
const schema = z.object({
    phone: z.string().min(7, "Phone number too short"),
    countryCode: z.string().nonempty("Select a country"),
});

type FormData = z.infer<typeof schema>;

export default function AuthForm() {
    const [countries, setCountries] = useState<{ name: string; code: string }[]>([]);
    const [otpSent, setOtpSent] = useState(false);
    const [mounted, setMounted] = useState(false);

    const { login } = useAuthStore();
    const { rooms, createRoom } = useChatStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: zodResolver(schema),
    });

    // Ensure client-side only
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (mounted) {
            fetchCountries().then(setCountries).catch(() => {
                toast.error("Failed to load countries.");
            });
        }
    }, [mounted]);

    if (!mounted) return null;

    const onSubmit = (data: FormData) => {
        toast.success("OTP sent!");
        setOtpSent(true);

        setTimeout(() => {
            // Store user login
            login(`${data.countryCode}${data.phone}`);
            toast.success("Logged in successfully!");

            // Redirect to first existing or new chatroom
            let targetRoomId: string;

            if (rooms.length > 0) {
                targetRoomId = rooms[0].id;
            } else {
                targetRoomId = createRoom("New Chat");
            }

            router.push(`/chat/${targetRoomId}`);
        }, 2000);
    };

    return (
        <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 shadow rounded-md">
            <h1 className="text-2xl font-bold mb-4 text-center">Login via OTP</h1>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div>
                    <label className="block mb-1">Country Code</label>
                    <select
                        {...register("countryCode")}
                        className="w-full p-2 border rounded bg-white text-black dark:bg-gray-800 dark:text-white"
                    >
                        <option value="">Select Country</option>
                        {countries.map((c) => (
                            <option key={c.name} value={c.code}>
                                {c.name} ({c.code})
                            </option>
                        ))}
                    </select>
                    {errors.countryCode && (
                        <p className="text-red-500 text-sm">{errors.countryCode.message}</p>
                    )}
                </div>

                <div>
                    <label className="block mb-1">Phone Number</label>
                    <input
                        type="tel"
                        {...register("phone")}
                        className="w-full p-2 border rounded"
                        placeholder="Enter your phone number"
                    />
                    {errors.phone && (
                        <p className="text-red-500 text-sm">{errors.phone.message}</p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
                >
                    {otpSent ? "Verifying..." : "Send OTP"}
                </button>
            </form>
        </div>
    );
}
