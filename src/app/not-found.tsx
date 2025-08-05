'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
    const router = useRouter();

    useEffect(() => {
        router.replace('/login');
    }, [router]);

    return <p className="text-center mt-10 text-gray-400">Redirecting to login...</p>;
}
