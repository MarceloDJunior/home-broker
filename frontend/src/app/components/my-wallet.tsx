'use client';

import Link from 'next/link';
import useSWR from 'swr';
import { WalletAsset } from '../models';
import { fetcher } from '../utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from './flowbite-components';

type Props = {
  walletId: string;
};

export const MyWallet = ({ walletId }: Props) => {
  const { data: walletAssets, isLoading } = useSWR<WalletAsset[]>(
    `/api/wallets/${walletId}/assets`,
    fetcher,
    { revalidateOnFocus: false, revalidateOnReconnect: false },
  );

  if (isLoading)
    return (
      <article className="text-white py-5 text-center">
        <p>Carregando...</p>
      </article>
    );

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
        {walletAssets?.map((walletAsset, key) => (
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
