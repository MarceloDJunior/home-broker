import { WalletAsset } from '../models';

const getWalletAssets = async (walletId: string): Promise<WalletAsset[]> => {
  const response = await fetch(
    `http://localhost:8000/wallets/${walletId}/assets`,
  );
  return await response.json();
};

type Props = {
  walletId: string;
};

const MyWallet = async ({ walletId }: Props) => {
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

export default MyWallet;
