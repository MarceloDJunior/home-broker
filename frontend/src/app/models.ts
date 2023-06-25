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

export type Order = {
  id: string;
  walletId: string;
  assetId: string;
  shares: string;
  partial: string;
  price: string;
  type: 'BUY' | 'SELL';
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'OPEN' | 'CLOSED' | 'FAILED';
  asset: Pick<Asset, 'id' | 'symbol'>;
};
