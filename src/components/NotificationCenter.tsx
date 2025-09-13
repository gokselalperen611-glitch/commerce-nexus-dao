import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Bell,
  BellRing,
  Check,
  CheckCircle2,
  AlertCircle,
  Info,
  AlertTriangle,
  X,
  Trash2,
  CheckCheck,
  ExternalLink
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { tr } from 'date-fns/locale';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'success':
      return <CheckCircle2 className="w-4 h-4 text-success" />;
    case 'error':
      return <AlertCircle className="w-4 h-4 text-destructive" />;
    case 'warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'info':
    default:
      return <Info className="w-4 h-4 text-primary" />;
  }
};

const NotificationItem = ({ notification, onRead, onRemove }: any) => {
  return (
    <Card className={`p-4 transition-all duration-200 ${
      notification.read ? 'bg-card/50' : 'bg-gradient-card border-primary/20'
    }`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <h4 className={`text-sm font-medium ${
              notification.read ? 'text-muted-foreground' : 'text-foreground'
            }`}>
              {notification.title}
            </h4>
            <div className="flex items-center space-x-1 ml-2">
              {!notification.read && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRead(notification.id)}
                  className="h-6 w-6 p-0"
                >
                  <Check className="w-3 h-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemove(notification.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-destructive"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
          
          <p className={`text-xs mt-1 ${
            notification.read ? 'text-muted-foreground/70' : 'text-muted-foreground'
          }`}>
            {notification.message}
          </p>
          
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-muted-foreground">
              {formatDistanceToNow(notification.timestamp, { 
                addSuffix: true, 
                locale: tr 
              })}
            </span>
            
            {notification.actionUrl && notification.actionText && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs text-primary hover:text-primary/80"
                onClick={() => window.open(notification.actionUrl, '_blank')}
              >
                {notification.actionText}
                <ExternalLink className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export const NotificationCenter = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    removeNotification, 
    clearAll 
  } = useNotifications();

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="relative p-2"
        >
          {unreadCount > 0 ? (
            <BellRing className="w-5 h-5" />
          ) : (
            <Bell className="w-5 h-5" />
          )}
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs bg-destructive"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="w-96 p-0 bg-background border border-border/50"
        align="end"
      >
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Bildirimler</h3>
            <div className="flex items-center space-x-2">
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs"
                >
                  <CheckCheck className="w-3 h-3 mr-1" />
                  Hepsini Okundu İşaretle
                </Button>
              )}
              {notifications.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearAll}
                  className="text-xs text-destructive hover:text-destructive/80"
                >
                  <Trash2 className="w-3 h-3 mr-1" />
                  Temizle
                </Button>
              )}
            </div>
          </div>
          
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground mt-1">
              {unreadCount} okunmamış bildirim
            </p>
          )}
        </div>

        <ScrollArea className="h-96">
          <div className="p-2">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Bell className="w-8 h-8 text-muted-foreground/50 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Henüz bildirim yok
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    onRead={markAsRead}
                    onRemove={removeNotification}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};