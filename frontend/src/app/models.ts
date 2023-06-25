export type Asset = {
  id: string;
  symbol: string;
  price: string;
};

export type WalletAsset = {
  id: string;
  walletId: string;
  assetId: string;
  shares: string;
  asset: Asset;
};
