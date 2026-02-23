import { useState, useEffect } from 'react';
import { Bell, Check, Users } from 'lucide-react';
import { API_BASE_URL } from '../config';
import { useAuth } from '../context/AuthContext';
import { getCsrfToken } from '../utils/csrf';
import './NotificationDropdown.css'; // Will create CSS separately or inline

interface Notification {
    id: number;
    type: string;
    message: string;
    read: boolean;
    createdAt: string;
}

interface NotificationDropdownProps {
    onOpenBroadcast: () => void;
}

export default function NotificationDropdown({ onOpenBroadcast }: NotificationDropdownProps) {
    const { token } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        if (!token) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/notifications`, {
                headers: { 'Authorization': token }
            });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
                setUnreadCount(data.filter((n: Notification) => !n.read).length);
            }
        } catch (e) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000); // Poll every 60s
        return () => clearInterval(interval);
    }, [token]);

    const markAsRead = async (id: number) => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/read/${id}`, {
                method: 'POST',
                headers: {
                    'Authorization': token || '',
                    'X-XSRF-TOKEN': getCsrfToken() || ''
                }
            });
            // Optimistic update
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (e) { console.error(e); }
    };

    const markAllAsRead = async () => {
        try {
            await fetch(`${API_BASE_URL}/api/notifications/read-all`, {
                method: 'POST',
                headers: {
                    'Authorization': token || '',
                    'X-XSRF-TOKEN': getCsrfToken() || ''
                }
            });
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (e) { console.error(e); }
    };

    return (
        <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setShowDropdown(!showDropdown)} style={{ position: 'relative' }}>
                <Bell size={20} />
                {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
            </button>

            {showDropdown && (
                <div className="notification-menu">
                    <div className="notification-header">
                        <h3>Notifications</h3>
                        <div style={{ display: 'flex', gap: '8px' }}>
                            <button className="btn-text-small" onClick={onOpenBroadcast} title="Broadcast to Team">
                                <Users size={14} /> Team Blast
                            </button>
                            <button className="btn-text-small" onClick={markAllAsRead} title="Mark all read">
                                <Check size={14} /> Clear
                            </button>
                        </div>
                    </div>
                    <div className="notification-list">
                        {notifications.length === 0 ? (
                            <div className="empty-state">No notifications</div>
                        ) : (
                            notifications.map(n => (
                                <div key={n.id} className={`notification-item ${n.read ? 'read' : 'unread'}`} onClick={() => markAsRead(n.id)}>
                                    <div className="notif-content">
                                        <p>{n.message}</p>
                                        <span className="time">{new Date(n.createdAt).toLocaleString()}</span>
                                    </div>
                                    {!n.read && <div className="dot"></div>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
