'use client';

import { PropsWithChildren, startTransition } from 'react';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { revalidateOrders } from '../actions/revalidate-orders';
import { apiBaseUrl } from '../http-client';
import { Order } from '../models';

type Props = {
  walletId: string;
};

export function SyncOrders({ walletId, children }: PropsWithChildren<Props>) {
  const { data, error } = useSWRSubscription(
    `${apiBaseUrl}/wallets/${walletId}/orders/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);
      eventSource.addEventListener('order-created', async (event) => {
        const orderCreated = JSON.parse(event.data) as Order;
        next(null, orderCreated);
        startTransition(() => {
          revalidateOrders(walletId);
        });
      });

      eventSource.addEventListener('order-updated', async (event) => {
        const orderUpdated = JSON.parse(event.data) as Order;
        next(null, orderUpdated);
        startTransition(() => {
          revalidateOrders(walletId);
        });
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };

      return () => {
        console.log('close event source');
        eventSource.close();
      };
    },
  );

  return <>{children}</>;
}
