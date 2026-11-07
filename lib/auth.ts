'use client';

import { useSyncExternalStore } from 'react';
import { onAuthStateChanged, type User } from 'firebase/auth';
import { auth, isConfigured } from './firebase';

interface AuthSnapshot {
    user: User | null;
    ready: boolean;
}

const SERVER_SNAPSHOT: AuthSnapshot = { user: null, ready: false };
let snapshot: AuthSnapshot = SERVER_SNAPSHOT;
const listeners = new Set<() => void>();
let started = false;

function emit() {
    listeners.forEach((l) => l());
}

function start() {
    if (started || typeof window === 'undefined') return;
    started = true;
    if (!isConfigured) {
        snapshot = { user: null, ready: true };
        return;
    }
    onAuthStateChanged(auth, (user) => {
        snapshot = { user, ready: true };
        emit();
    });
}

/** Re-reads the signed-in user, e.g. after their display name changes. */
export function refreshAuthUser() {
    snapshot = { user: auth.currentUser, ready: true };
    emit();
}

/** The signed-in Firebase user, shared across the app. */
export function useAuth() {
    return useSyncExternalStore(
        (cb) => {
            start();
            listeners.add(cb);
            return () => listeners.delete(cb);
        },
        () => snapshot,
        () => SERVER_SNAPSHOT,
    );
}

export function initialsOf(name: string | null | undefined, email?: string | null) {
    const source = (name || email || '').trim();
    if (!source) return '';
    const parts = source.split(/[\s@._-]+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')).toUpperCase();
}

/** Plain-language messages for Firebase auth error codes. */
export function authErrorMessage(err: unknown) {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
            return "That email and password don't match. Try again?";
        case 'auth/email-already-in-use':
            return 'An account with this email already exists. Log in instead?';
        case 'auth/weak-password':
            return 'Use a password with at least 6 characters.';
        case 'auth/invalid-email':
            return "That email address doesn't look right.";
        case 'auth/too-many-requests':
            return 'Too many attempts. Take a breather and try again in a few minutes.';
        case 'auth/network-request-failed':
            return 'We could not reach the server. Check your connection and try again.';
        default:
            return 'Something went wrong. Please try again.';
    }
}
