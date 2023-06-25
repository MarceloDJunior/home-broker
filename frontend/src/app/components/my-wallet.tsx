import { HttpClient } from '../http-client';
import { WalletAsset } from '../models';
import { isHomeBrokerClosed } from '../utils';

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
