import Link from 'next/link';
import { HttpClient } from '../http-client';
import { WalletAsset } from '../models';
import { isHomeBrokerClosed } from '../utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';

const getWalletAssets = async (walletId: string): Promise<WalletAsset[]> => {
  const oneHour = 60 * 60;
  return await HttpClient.get(`/wallets/${walletId}/assets`, {
    revalidate: isHomeBrokerClosed() ? oneHour : 5,
  });
};

type Props = {
  walletId: string;
};

export const MyWallet = async ({ walletId }: Props) => {
  const walletAssets = await getWalletAssets(walletId);

  return (
    <Table>
      <TableHead>
        <TableHeadCell>Nome</TableHeadCell>
        <TableHeadCell>Preço R$</TableHeadCell>
        <TableHeadCell>Quant.</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Comprar/Vender</span>
        </TableHeadCell>
      </TableHead>
      <TableBody className="divide-y">
        {walletAssets!.map((walletAsset, key) => (
          <TableRow className="border-gray-700 bg-gray-800" key={key}>
            <TableCell className="whitespace-nowrap font-medium text-white">
              {walletAsset.asset.id} ({walletAsset.asset.symbol})
            </TableCell>
            <TableCell>{walletAsset.asset.price}</TableCell>
            <TableCell>{walletAsset.shares}</TableCell>
            <TableCell>
              <Link
                className="font-medium hover:underline text-cyan-500"
                href={`/${walletId}/home-broker/${walletAsset.asset.id}`}
              >
                Comprar/Vender
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
