"use client";

import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";
import { getStatusLabel } from "@/lib/utils";

/**
 * Subscribes to real-time order status changes for the current user
 * and shows toast notifications when an order status is updated.
 */
export function useOrderNotifications() {
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;
      userIdRef.current = user.id;

      channel = supabase
        .channel("customer-order-notifications")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "orders",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const newStatus = payload.new.status as string;
            const oldStatus = payload.old.status as string;
            const orderNumber = payload.new.order_number as string;

            // Only notify when status actually changed
            if (newStatus === oldStatus) return;

            const label = getStatusLabel(newStatus);
            toast.success(`Your order #${orderNumber} is now ${label}!`, {
              duration: 5000,
            });
          },
        )
        .subscribe();
    }

    setup();

    return () => {
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);
}
