import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

const SEEN_KEY = 'dgi_seen_ids';
const NOTIF_KEY = 'dgi_notifications';
const POLL_INTERVAL_MS = 20000;
const MAX_NOTIFICATIONS = 30;

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function loadSeenSet() {
  const stored = loadJSON(SEEN_KEY, null); // null = pas encore initialisé (1er poll = seed silencieux)
  return stored ? new Set(stored) : null;
}

export function useNotifications(enabled) {
  const [notifications, setNotifications] = useState(() => loadJSON(NOTIF_KEY, []));
  const seenRef = useRef(loadSeenSet());

  const poll = useCallback(async () => {
    let accounts = [];
    let payments = [];
    try {
      [accounts, payments] = await Promise.all([api.listAccounts(), api.listPayments()]);
    } catch {
      return; // silencieux : la liste réessaiera au prochain cycle
    }

    const currentIds = new Set([
      ...accounts.map((a) => `ACCOUNT:${a.transactionId}`),
      ...payments.map((p) => `PAYMENT:${p.transactionId}`),
    ]);

    if (seenRef.current === null) {
      // Premier chargement : on mémorise l'existant sans générer de notifications.
      seenRef.current = currentIds;
      localStorage.setItem(SEEN_KEY, JSON.stringify([...currentIds]));
      return;
    }

    const newOnes = [...currentIds].filter((id) => !seenRef.current.has(id));
    if (newOnes.length === 0) return;

    seenRef.current = currentIds;
    localStorage.setItem(SEEN_KEY, JSON.stringify([...currentIds]));

    const fresh = newOnes.map((id) => {
      const [type, transactionId] = id.split(':');
      return { id, type, transactionId, read: false, createdAt: Date.now() };
    });

    setNotifications((prev) => {
      const merged = [...fresh, ...prev].slice(0, MAX_NOTIFICATIONS);
      localStorage.setItem(NOTIF_KEY, JSON.stringify(merged));
      return merged;
    });
  }, []);

  useEffect(() => {
    if (!enabled) return undefined;
    poll();
    const timer = setInterval(poll, POLL_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [enabled, poll]);

  const markRead = useCallback(
    (id) => {
      setNotifications((prev) => {
        const updated = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
        localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
        return updated;
      });
    },
    [],
  );

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const updated = prev.map((n) => ({ ...n, read: true }));
      localStorage.setItem(NOTIF_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  return { notifications, unreadCount, markRead, markAllRead };
}
