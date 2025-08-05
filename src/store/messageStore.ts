import { create } from "zustand";
import { persist } from "zustand/middleware"; // <-- for localStorage
import { nanoid } from "nanoid";
import { useChatStore } from "./chatStore"; // Import chat store

interface Message {
    id: string;
    roomId: string;
    sender: "user" | "ai";
    content: string;
    timestamp: string;
    imageUrl?: string;
}

interface MessageState {
    messages: Message[];
    isTyping: boolean;
    sendMessage: (roomId: string, content: string, imageUrl?: string) => void;
    sendAIReply: (roomId: string, isImage?: boolean) => void;
    getMessagesByRoom: (roomId: string) => Message[];
}

export const useMessageStore = create<MessageState>()(
    persist(
        (set, get) => ({
            messages: [],
            isTyping: false,

            sendMessage: (roomId, content, imageUrl) => {
                const newMessage: Message = {
                    id: nanoid(),
                    roomId,
                    sender: "user",
                    content,
                    timestamp: new Date().toISOString(),
                    imageUrl,
                };

                const allMessages = get().messages.filter((msg) => msg.roomId === roomId);
                const userMessages = allMessages.filter((msg) => msg.sender === "user");
                const isFirstUserMessage = userMessages.length === 0;

                const chatStore = useChatStore.getState();
                const room = chatStore.rooms.find((r) => r.id === roomId);

                if (
                    isFirstUserMessage &&
                    room &&
                    (room.name === "New Chat" || room.name.startsWith("Chatroom"))
                ) {
                    const shortName = content.trim().slice(0, 30); // First 30 chars
                    chatStore.renameRoom(roomId, shortName || "New Chat");
                }

                set((state) => ({
                    messages: [...state.messages, newMessage],
                    isTyping: true,
                }));

                get().sendAIReply(roomId, !!imageUrl);
            },

            sendAIReply: (roomId, isImage = false) => {
                setTimeout(() => {
                    const reply: Message = {
                        id: nanoid(),
                        roomId,
                        sender: "ai",
                        content: isImage
                            ? "Nice image! Looks interesting. 📷"
                            : "This is a simulated AI response.",
                        timestamp: new Date().toISOString(),
                    };

                    set((state) => ({
                        messages: [...state.messages, reply],
                        isTyping: false,
                    }));
                }, 1500); // Simulated delay
            },

            getMessagesByRoom: (roomId) =>
                get().messages.filter((msg) => msg.roomId === roomId),
        }),
        {
            name: "messages-storage", // 🔐 localStorage key
        }
    )
);
