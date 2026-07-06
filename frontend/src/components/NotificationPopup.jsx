import React, { useEffect, useState } from 'react';
import { Bell, X, Trash2 } from 'lucide-react';
import { studentAPI } from '../services/api';

const NotificationPopup = ({ show, onClose, notifications, onDelete, onMarkAsRead }) => {
  if (!show) return null;

  const unreadNotifications = notifications.filter(n => !n.isRead);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-dark-card border border-dark-border rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-dark-card border-b border-dark-border p-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-primary-400" />
            <h3 className="text-lg font-bold text-white">Notifications</h3>
            {unreadNotifications.length > 0 && (
              <span className="px-2 py-0.5 bg-primary-500 text-white text-xs font-medium rounded-full">
                {unreadNotifications.length} new
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="overflow-y-auto max-h-[calc(80vh-120px)] p-4">
          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <Bell className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">No notifications</p>
            </div>
          ) : (
            <div className="space-y-2">
              {notifications.map(notif => (
                <div
                  key={notif.id}
                  className={`p-4 rounded-lg border transition-all ${
                    notif.isRead
                      ? 'bg-dark-hover border-dark-border'
                      : 'bg-primary-500/10 border-primary-500/30'
                  }`}
                >
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {!notif.isRead && (
                          <span className="w-2 h-2 bg-primary-500 rounded-full"></span>
                        )}
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          notif.type === 'ANNOUNCEMENT' || notif.type === 'DEPT_ANNOUNCEMENT'
                            ? 'bg-blue-500/20 text-blue-400'
                            : notif.type === 'ACHIEVEMENT_APPROVED'
                            ? 'bg-green-500/20 text-green-400'
                            : notif.type === 'ACHIEVEMENT_REJECTED'
                            ? 'bg-red-500/20 text-red-400'
                            : 'bg-slate-500/20 text-slate-400'
                        }`}>
                          {notif.type?.replace('_', ' ')}
                        </span>
                        {notif.sentBy && (
                          <span className="text-xs text-slate-500">
                            from {notif.sentBy}
                          </span>
                        )}
                      </div>
                      <p className="text-white text-sm mb-1">{notif.message}</p>
                      <p className="text-slate-500 text-xs">
                        {new Date(notif.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {!notif.isRead && (
                        <button
                          onClick={() => onMarkAsRead(notif.id)}
                          className="text-primary-400 hover:text-primary-300 text-xs transition-colors"
                        >
                          Mark read
                        </button>
                      )}
                      <button
                        onClick={() => onDelete(notif.id)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && unreadNotifications.length > 0 && (
          <div className="sticky bottom-0 bg-dark-card border-t border-dark-border p-4">
            <button
              onClick={async () => {
                try {
                  await studentAPI.markAllAsRead();
                  window.location.reload();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full px-4 py-2 text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPopup;
