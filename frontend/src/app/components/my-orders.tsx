import { HttpClient } from '../http-client';
import { Order } from '../models';
import { isHomeBrokerClosed } from '../utils';
import {
  Badge,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';

const getOrders = async (walletId: string): Promise<Order[]> => {
  const oneHour = 60 * 60;
  return await HttpClient.get(`/wallets/${walletId}/orders`, {
    tag: `orders-wallet-${walletId}`,
    revalidate: isHomeBrokerClosed() ? oneHour : 5,
  });
};

type Props = {
  walletId: string;
};

export const MyOrders = async ({ walletId }: Props) => {
  const orders = await getOrders(walletId);

  return (
    <div>
      <article className="format format-invert">
        <h2>Minha ordens</h2>
      </article>
      <Table className="mt-2">
        <TableHead>
          <TableHeadCell>asset_id</TableHeadCell>
          <TableHeadCell>quant.</TableHeadCell>
          <TableHeadCell>price</TableHeadCell>
          <TableHeadCell>tipo</TableHeadCell>
          <TableHeadCell>status</TableHeadCell>
        </TableHead>
        <TableBody>
          {orders.map((order, key) => (
            <TableRow className=" border-gray-700 bg-gray-800" key={key}>
              <TableCell className="whitespace-nowrap font-medium text-white">
                {order.asset.id}
              </TableCell>
              <TableCell>{order.shares}</TableCell>
              <TableCell>{order.price}</TableCell>
              <TableCell>
                <Badge className="text-center">{order.type}</Badge>
              </TableCell>
              <TableCell>
                <Badge className="text-center">{order.status}</Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
