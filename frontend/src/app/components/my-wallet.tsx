'use client';

import humps from 'humps';
import Link from 'next/link';
import useSWR from 'swr';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { apiBaseUrl } from '../http-client';
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
  const {
    data: walletAssets,
    isLoading,
    mutate: mutateWalletAssets,
  } = useSWR<WalletAsset[]>(`/api/wallets/${walletId}/assets`, fetcher, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  useSWRSubscription(
    `${apiBaseUrl}/wallets/${walletId}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);
      eventSource.addEventListener('wallet-asset-updated', async (event) => {
        const walletAssetUpdated = humps.camelizeKeys(
          JSON.parse(event.data),
        ) as WalletAsset;
        console.log(walletAssetUpdated)
        await mutateWalletAssets((prev) => {
          const foundIndex = prev?.findIndex(
            (walletAsset) => walletAsset.assetId === walletAssetUpdated.assetId,
          );
          if (prev && foundIndex !== -1) {
            prev[foundIndex!].shares = walletAssetUpdated.shares;
          }
          return prev;
        }, false);
        next(null, walletAssetUpdated);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        return () => eventSource.close();
      };
      return () => eventSource.close();
    },
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
