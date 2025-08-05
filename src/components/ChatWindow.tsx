'use client';

import { useMessageStore } from '@/store/messageStore';
import { useChatStore } from '@/store/chatStore';
import { useEffect, useRef, useState } from 'react';
import TypingDots from './TypingDots';
import toast from 'react-hot-toast';
import { Copy } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';


interface Props {
    roomId: string;
}

export default function ChatWindow({ roomId }: Props) {
    const { rooms } = useChatStore();
    const { messages, sendMessage, isTyping } = useMessageStore();

    const [input, setInput] = useState('');
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    const chatroom = rooms.find((r) => r.id === roomId);
    const roomMessages = messages.filter((msg) => msg.roomId === roomId);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [roomMessages]);

    const handleSend = () => {
        if (!input.trim() && !imagePreview) return;
        sendMessage(roomId, input, imagePreview ?? undefined);
        setInput('');
        setImagePreview(null);
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const maxSize = 2 * 1024 * 1024;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (!allowedTypes.includes(file.type)) {
            toast.error('Only JPG, PNG, WebP allowed.');
            return;
        }
        if (file.size > maxSize) {
            toast.error('Image must be under 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    if (!chatroom) {
        return <div className="p-6 text-gray-500">Chatroom not found.</div>;
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b dark:border-gray-700 font-semibold text-lg">
                Chatroom: {chatroom.name}
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="mx-auto max-w-[70%]">

                    {roomMessages.map((msg) => {
                        const isUser = msg.sender === 'user';

                        return (
                            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className="relative max-w-[80%] group">
                                    <div
                                        className={`p-3 rounded-2xl text-sm shadow-md ${isUser
                                            ? 'bg-blue-600 text-white rounded-br-none'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-none'
                                            }`}
                                    >
                                        {msg.imageUrl && (
                                            <img
                                                src={msg.imageUrl}
                                                alt="sent"
                                                className="rounded-lg max-w-xs max-h-48 mb-2"
                                            />
                                        )}
                                        {msg.content && <p>{msg.content}</p>}
                                        <div className="flex justify-between items-center mt-2 text-[10px] opacity-60">
                                            <span>{new Date(msg.timestamp).toLocaleTimeString()}</span>
                                            {!isUser && msg.content && (
                                                <div className="relative">
                                                    <button
                                                        onClick={() => {
                                                            navigator.clipboard.writeText(msg.content);
                                                            toast.success('Copied!');
                                                            setCopiedId(msg.id);
                                                            setTimeout(() => setCopiedId(null), 1000);
                                                        }}
                                                        className="text-white/60 hover:text-white cursor-pointer relative group"
                                                    >
                                                        <Copy className="w-4 h-4" />
                                                        <div className="absolute top-full mt-1 right-0 bg-black text-white text-[10px] px-2 py-0.5 rounded shadow opacity-0 group-hover:opacity-100 transition">
                                                            {copiedId === msg.id ? 'Copied!' : 'Copy'}
                                                        </div>
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-sm italic px-3 py-2 rounded-2xl">
                                <TypingDots />
                            </div>
                        </div>
                    )}

                    <div ref={bottomRef} />
                </div>
            </div>

            {imagePreview && (
                <div className="flex justify-center py-2">
                    <div className="relative w-40 h-40 rounded-lg overflow-hidden border shadow">
                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                        <button
                            onClick={() => setImagePreview(null)}
                            className="absolute top-1 right-1 text-white bg-black/60 hover:bg-red-600 px-2 py-0.5 text-xs rounded"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            <div className="p-4 dark:border-gray-700">
                <div className="mx-auto max-w-[70%]">
                    <div className="flex items-center gap-2 bg-white dark:bg-gray-900 p-3 rounded-full shadow">
                        <label className="cursor-pointer">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <span>
                                <FontAwesomeIcon icon={faPlus} className="text-sm ml-2" />
                            </span>
                        </label>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend(); 
                                }
                            }}
                            placeholder="Ask Gemini"
                            className="flex-1 bg-transparent outline-none px-2 text-sm"
                        />

                        <button
                            onClick={handleSend}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-full text-sm cursor-pointer"
                        >
                            Send
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
