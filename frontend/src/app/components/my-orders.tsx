import { HttpClient } from '../http-client';
import { Order } from '../models';
import { isHomeBrokerClosed } from '../utils';

const getOrders = async (walletId: string): Promise<Order[]> => {
  const oneHour = 60 * 60;
  return await HttpClient.get(`/wallets/${walletId}/orders`, {
    tag: `orders-waller-${walletId}`,
    revalidate: isHomeBrokerClosed() ? oneHour : 5,
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
            {order.asset.id} - {order.shares} - R$ {order.price} -{' '}
            {order.status}
          </li>
        );
      })}
    </ul>
  );
};
