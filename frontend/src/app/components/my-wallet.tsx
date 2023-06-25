import { HttpClient } from '../http-client';
import { WalletAsset } from '../models';

const getWalletAssets = async (walletId: string): Promise<WalletAsset[]> => {
  return await HttpClient.get(`/wallets/${walletId}/assets`);
};

type Props = {
  walletId: string;
};

export const MyWallet = async ({ walletId }: Props) => {
  const walletAssets = await getWalletAssets(walletId);

  return (
    <ul>
      {walletAssets.map((walletAsset) => {
        console.log(walletAsset);
        return (
          <li key={walletAsset.id}>
            {walletAsset.asset.id} - {walletAsset.shares} - R${' '}
            {walletAsset.asset.price}
          </li>
        );
      })}
    </ul>
  );
};
