'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useChatStore } from '@/store/chatStore';
import { useMessageStore } from '@/store/messageStore';
import ChatWindow from '@/components/ChatWindow';
import Sidebar from '@/components/Sidebar';

export default function ChatRoomPage() {
    const router = useRouter();
    const { selectedRoomId } = useChatStore();
    const { isLoggedIn } = useAuthStore();

    const [hasHydrated, setHasHydrated] = useState(false);

    useEffect(() => {
        // Wait for Zustand to hydrate from localStorage
        setHasHydrated(true);
    }, []);

    useEffect(() => {
        if (hasHydrated && !isLoggedIn) {
            router.push('/login');
        }
    }, [hasHydrated, isLoggedIn, router]);

    if (!hasHydrated) return null;

    return (
        <div className="flex h-screen overflow-hidden">
            {/* Sidebar (left) */}
            <aside className="w-64 bg-white dark:bg-gray-900 border-r overflow-y-auto">
                <Sidebar />
            </aside>

            {/* Main chat area (right) */}
            <main className="flex-1 bg-gray-50 dark:bg-gray-800">
                {selectedRoomId ? (
                    <ChatWindow roomId={selectedRoomId} />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-lg">
                        Select or create a chatroom to begin
                    </div>
                )}
            </main>
        </div>
    );
}
