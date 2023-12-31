'use client';

import humps from 'humps';
import Link from 'next/link';
import useSWR from 'swr';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { apiBaseUrl } from '../http-client';
import { Asset, WalletAsset } from '../models';
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

  // TODO: Check why it doesn't work if I remove the destructuring
  const { data: updatedAssets } = useSWRSubscription(
    `${apiBaseUrl}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);
      eventSource.addEventListener('asset-price-changed', async (event) => {
        const assetChanged = humps.camelizeKeys(
          JSON.parse(event.data),
        ) as Asset;
        console.log(assetChanged);
        await mutateWalletAssets((prev) => {
          const updatedWalletAssets = [...(prev ?? [])];
          const foundIndex = updatedWalletAssets.findIndex(
            (walletAsset) => walletAsset.assetId === assetChanged.id,
          );
          if (foundIndex !== -1) {
            updatedWalletAssets[foundIndex!].asset.price = assetChanged.price;
          }
          return updatedWalletAssets;
        });

        next(null, assetChanged);
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

  const { data: updatedWalletAssets } = useSWRSubscription(
    `${apiBaseUrl}/wallets/${walletId}/assets/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);
      eventSource.addEventListener('wallet-asset-updated', async (event) => {
        const walletAssetUpdated = humps.camelizeKeys(
          JSON.parse(event.data),
        ) as WalletAsset;
        console.log(walletAssetUpdated);
        await mutateWalletAssets((prev) => {
          const updatedWalletAssets = [...(prev ?? [])];
          const foundIndex = updatedWalletAssets.findIndex(
            (walletAsset) => walletAsset.assetId === walletAssetUpdated.assetId,
          );
          if (foundIndex !== -1) {
            updatedWalletAssets[foundIndex!].shares = walletAssetUpdated.shares;
          }
          return updatedWalletAssets;
        });
        next(null, walletAssetUpdated);
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

  if (isLoading)
    return (
      <article className="text-white py-5 text-center">
        <p>Loading...</p>
      </article>
    );

  return (
    <Table>
      <TableHead>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>Price $</TableHeadCell>
        <TableHeadCell>Shares</TableHeadCell>
        <TableHeadCell>
          <span className="sr-only">Buy/Sell</span>
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
                Buy/Sell
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
