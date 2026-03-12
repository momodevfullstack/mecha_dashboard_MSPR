import React, { useState, useEffect } from 'react';
import { AlertTriangle, Wrench, Lightbulb, X } from 'lucide-react';
import { cn } from '../utils/cn';

type NotificationType = 'MAINTENANCE' | 'RISK' | 'MODEL_PROPOSAL';

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
}

const NOTIFICATION_TYPES: NotificationType[] = ['MAINTENANCE', 'RISK', 'MODEL_PROPOSAL'];

const generateRandomNotification = (): Notification => {
  const type = NOTIFICATION_TYPES[Math.floor(Math.random() * NOTIFICATION_TYPES.length)];
  const id = Math.random().toString(36).substring(2, 9);
  const machineId = `M-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  switch (type) {
    case 'MAINTENANCE':
      return {
        id,
        type,
        title: 'Maintenance Requise',
        message: `La machine ${machineId} nécessite une lubrification du roulement principal.`,
      };
    case 'RISK':
      return {
        id,
        type,
        title: 'Risque de Panne Élevé',
        message: `Surchauffe détectée sur ${machineId}. Arrêt préventif recommandé.`,
      };
    case 'MODEL_PROPOSAL':
    default:
      return {
        id,
        type,
        title: 'Proposition du Modèle',
        message: `Optimisation possible : réduire la vitesse de ${machineId} de 5% pour prolonger la durée de vie.`,
      };
  }
};

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const newNotification = generateRandomNotification();
      
      setNotifications((prev) => {
        // Keep only the latest 2 notifications to avoid screen clutter
        const updated = [...prev, newNotification];
        return updated.slice(-2);
      });

      // Auto-remove after 6 seconds
      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== newNotification.id));
      }, 6000);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 w-80 pointer-events-none">
      {notifications.map((notification) => {
        let Icon = Lightbulb;
        let colorClass = 'bg-indigo-50 border-indigo-200 text-indigo-800';
        let iconColor = 'text-indigo-500';

        if (notification.type === 'MAINTENANCE') {
          Icon = Wrench;
          colorClass = 'bg-amber-50 border-amber-200 text-amber-800';
          iconColor = 'text-amber-500';
        } else if (notification.type === 'RISK') {
          Icon = AlertTriangle;
          colorClass = 'bg-rose-50 border-rose-200 text-rose-800';
          iconColor = 'text-rose-500';
        }

        return (
          <div
            key={notification.id}
            className={cn(
              'pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-in slide-in-from-right-8 fade-in',
              colorClass
            )}
          >
            <Icon className={cn('w-5 h-5 shrink-0 mt-0.5', iconColor)} />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold">{notification.title}</h4>
              <p className="text-xs mt-1 opacity-90 leading-relaxed">{notification.message}</p>
            </div>
            <button
              onClick={() => removeNotification(notification.id)}
              className="shrink-0 p-1 opacity-50 hover:opacity-100 transition-opacity"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
