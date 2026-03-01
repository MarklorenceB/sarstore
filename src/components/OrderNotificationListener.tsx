"use client";

import { useOrderNotifications } from "@/hooks/useOrderNotifications";

export function OrderNotificationListener() {
  useOrderNotifications();
  return null;
}
