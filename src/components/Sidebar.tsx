'use client';

import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faPen, faTrashCan, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { MoreVertical } from 'lucide-react';

export default function Sidebar() {
    const {
        rooms,
        createRoom,
        deleteRoom,
        renameRoom,
        selectedRoomId,
        setSelectedRoomId,
    } = useChatStore();

    const { logout } = useAuthStore();
    const router = useRouter();

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredRooms, setFilteredRooms] = useState(rooms);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
    const [mounted, setMounted] = useState(false); // prevent hydration mismatch

    useEffect(() => {
        setMounted(true);
    }, []);

    // 🔍 Debounced search
    useEffect(() => {
        if (!mounted) return;
        const timer = setTimeout(() => {
            const filtered = rooms.filter((room) =>
                room.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredRooms(filtered);
        }, 300);
        return () => clearTimeout(timer);
    }, [searchTerm, rooms, mounted]);

    const handleNewChat = () => {
        const id = createRoom();
        setSelectedRoomId(id);
    };

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    if (!mounted) return null;

    return (
        <div className="p-4 space-y-4 text-sm h-full flex flex-col">
            {/* New Chat Button */}
            <button
                onClick={handleNewChat}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
            >
                <FontAwesomeIcon icon={faPenToSquare} className="text-sm mr-2" />
                New Chat
            </button>

            {/* Search Box */}
            <input
                type="text"
                placeholder="Search chats..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-2 py-1 border rounded text-sm dark:bg-gray-800 dark:text-white"
            />

            {/* Chatroom List */}
            <div className="space-y-2 overflow-y-auto flex-1">
                {filteredRooms.map((room) => {
                    const isEditing = editingId === room.id;

                    return (
                        <div
                            key={room.id}
                            onClick={() => setSelectedRoomId(room.id)}
                            className={`relative p-2 rounded-lg cursor-pointer flex justify-between items-center group ${room.id === selectedRoomId
                                ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-white font-semibold'
                                : 'hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                                }`}
                        >
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={editValue}
                                    onChange={(e) => setEditValue(e.target.value)}
                                    onBlur={() => {
                                        renameRoom(room.id, editValue.trim() || 'Untitled Chat');
                                        setEditingId(null);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            renameRoom(room.id, editValue.trim() || 'Untitled Chat');
                                            setEditingId(null);
                                        }
                                    }}
                                    className="bg-transparent border-b outline-none flex-1"
                                    autoFocus
                                />
                            ) : (
                                <span className="flex-1 truncate">{room.name}</span>
                            )}

                            {/* Menu toggle */}
                            <div className="relative mt-1">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDropdownOpen(dropdownOpen === room.id ? null : room.id);
                                    }}
                                    className="cursor-pointer invisible group-hover:visible px-1 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                                >
                                    <MoreVertical size={16} />
                                </button>

                                {/* Dropdown */}
                                {dropdownOpen === room.id && (
                                    <div className="absolute right-0 mt-2 w-28 bg-white dark:bg-gray-800 border rounded-lg shadow z-10 text-xs">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setEditingId(room.id);
                                                setEditValue(room.name);
                                                setDropdownOpen(null);
                                            }}
                                            className="w-full px-3 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faPen} className="text-gray-500 mr-2" />
                                            Rename
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteRoom(room.id);
                                                setDropdownOpen(null);
                                            }}
                                            className="w-full px-3 py-2 text-left text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer"
                                        >
                                            <FontAwesomeIcon icon={faTrashCan} className="text-gray-500 hover:text-red-500 mr-2" />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Logout Button */}
            <button
                onClick={handleLogout}
                className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-sm cursor-pointer"
            >
                <FontAwesomeIcon icon={faRightFromBracket} className="mr-2" />
                Logout
            </button>
        </div>
    );
}
