export type Asset = {
  id: string;
  symbol: string;
  price: number;
};

export type AssetDaily = {
  id: string;
  asset_id: string;
  date: string;
  price: number;
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
  price: number;
  type: 'BUY' | 'SELL';
  createdAt: string;
  updatedAt: string;
  status: 'PENDING' | 'OPEN' | 'CLOSED' | 'FAILED';
  asset: Pick<Asset, 'id' | 'symbol'>;
};
