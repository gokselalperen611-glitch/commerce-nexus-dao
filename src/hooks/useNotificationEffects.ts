import { useEffect } from 'react';
import { useAuth } from './useAuth';
import { useNotifications } from '@/contexts/NotificationContext';

// Demo notification effects for development
export const useNotificationEffects = () => {
  const { user } = useAuth();
  const { notify } = useNotifications();

  // Welcome notification on login
  useEffect(() => {
    if (user) {
      const hasShownWelcome = localStorage.getItem(`welcome_shown_${user.id}`);
      if (!hasShownWelcome) {
        setTimeout(() => {
          notify.success(
            "Hoş geldiniz!",
            "CommerceDAO platformuna başarıyla giriş yaptınız.",
            {
              actionUrl: "/dashboard",
              actionText: "Dashboard'u Keşfet"
            }
          );
          localStorage.setItem(`welcome_shown_${user.id}`, 'true');
        }, 1500);
      }
    }
  }, [user, notify]);

  // Demo system notifications
  const triggerDemoNotifications = () => {
    // Token earned notification
    notify.success(
      "Token Kazandınız!",
      "Alışveriş yaptığınız için 50 DEMO token kazandınız.",
      {
        actionUrl: "/dashboard",
        actionText: "Bakiyemi Görüntüle"
      }
    );

    // Governance notification
    setTimeout(() => {
      notify.info(
        "Yeni Proposal",
        "Katıldığınız mağazada yeni bir oylama başlatıldı.",
        {
          actionUrl: "/governance",
          actionText: "Oylamaya Katıl"
        }
      );
    }, 2000);

    // System maintenance notification
    setTimeout(() => {
      notify.warning(
        "Sistem Bakımı",
        "Sistem bakımı 15:00-16:00 saatleri arasında yapılacaktır."
      );
    }, 4000);

    // New store notification
    setTimeout(() => {
      notify.info(
        "Yeni Mağaza",
        "TechStore mağazası platformumuza katıldı. Keşfetmeye ne dersiniz?",
        {
          actionUrl: "/stores",
          actionText: "Mağazaları Görüntüle"
        }
      );
    }, 6000);
  };

  return { triggerDemoNotifications };
};