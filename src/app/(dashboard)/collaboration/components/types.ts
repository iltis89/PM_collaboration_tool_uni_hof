/**
 * Shared types for the Collaboration feature.
 */

export interface Thread {
    id: string;
    title: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
    _count?: { messages: number };
}

export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
}

export interface ThreadDetailData extends Thread {
    messages: Message[];
}

export interface ChatMessage {
    id: string;
    content: string;
    createdAt: Date;
    authorId: string;
    author?: { id: string; name: string };
}

export interface CurrentUser {
    id: string;
    role: string;
}
