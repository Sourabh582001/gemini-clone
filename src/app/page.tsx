'use client';

import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HomePage() {
    
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
