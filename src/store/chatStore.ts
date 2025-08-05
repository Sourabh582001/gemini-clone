import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";

interface ChatRoom {
    id: string;
    name: string;
    createdAt: Date;
}

interface ChatState {
    rooms: ChatRoom[];
    selectedRoomId: string | null;
    createRoom: (name?: string) => string; // 🔥 Accept optional name
    deleteRoom: (id: string) => void;
    renameRoom: (id: string, newName: string) => void;
    setSelectedRoomId: (id: string) => void;
}

export const useChatStore = create<ChatState>()(
    persist(
        (set, get) => ({
            rooms: [],
            selectedRoomId: null,

            setSelectedRoomId: (id) => set({ selectedRoomId: id }),

            createRoom: (name = "New Chat") => {
                const newRoom = {
                    id: nanoid(),
                    name,
                    createdAt: new Date(),
                };

                set((state) => ({
                    rooms: [newRoom, ...state.rooms], // newest on top
                }));

                return newRoom.id;
            },

            renameRoom: (id, newName) =>
                set((state) => ({
                    rooms: state.rooms.map((room) =>
                        room.id === id ? { ...room, name: newName } : room
                    ),
                })),

            deleteRoom: (id) =>
                set((state) => ({
                    rooms: state.rooms.filter((room) => room.id !== id),
                })),
        }),
        {
            name: "chat-rooms", // stored in localStorage
        }
    )
);
