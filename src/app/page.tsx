'use client';

import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
    const { selectedRoomId } = useChatStore();
    const { isLoggedIn } = useAuthStore();
    const router = useRouter();
    const [mounted, setMounted] = useState(false);

    // Protect route
    useEffect(() => {
        setMounted(true);
        if (!isLoggedIn) {
            router.push('/login');
        }
    }, [isLoggedIn, router]);


    if (!mounted || !isLoggedIn) return null;

    return (
        <div></div>
    );
}
