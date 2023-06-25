import { HttpClient } from '../http-client';
import { Order } from '../models';

const getOrders = async (walletId: string): Promise<Order[]> => {
  return await HttpClient.get(`/wallets/${walletId}/orders`, {
    tag: `orders-waller-${walletId}`,
  });
};

type Props = {
  walletId: string;
};

export const MyOrders = async ({ walletId }: Props) => {
  const orders = await getOrders(walletId);

  return (
    <ul>
      {orders.map((order) => {
        console.log(order);
        return (
          <li key={order.id}>
            {order.asset.id} - {order.shares} - R$ {order.price} - {order.status}
          </li>
        );
      })}
    </ul>
  );
};
