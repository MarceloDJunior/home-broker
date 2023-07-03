'use server';

import { revalidateTag } from 'next/cache';

export async function revalidateOrders(walletId: string) {
  revalidateTag(`orders-wallet-${walletId}`);
}
