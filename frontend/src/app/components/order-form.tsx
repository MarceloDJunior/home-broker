import { revalidateTag } from 'next/cache';
import { HttpClient } from '../http-client';

const initTransaction = async (formData: FormData) => {
  'use server';
  const shares = formData.get('shares');
  const price = formData.get('price');
  const assetId = formData.get('assetId');
  const walletId = formData.get('walletId');
  const type = formData.get('type');
  const response = await HttpClient.post(
    `/wallets/${walletId}/orders`,
    JSON.stringify({
      shares,
      price,
      type,
      asset_id: assetId,
      status: 'OPEN',
      Asset: {
        id: assetId,
        symbol: 'PETR4',
        price: 300,
      },
    }),
  );
  revalidateTag(`orders-waller-${walletId}`);
  return response;
};

type Props = {
  assetId: string;
  walletId: string;
};

export const OrderForm = ({ assetId, walletId }: Props) => {
  return (
    <div>
      <h1>Order Form</h1>
      <form action={initTransaction}>
        <input type="hidden" name="assetId" defaultValue={assetId} />
        <input type="hidden" name="walletId" defaultValue={walletId} />
        <input type="hidden" name="type" defaultValue="BUY" />
        <input
          type="number"
          name="shares"
          min={1}
          step={1}
          placeholder="Quantidade"
        />
        <br />
        <input
          type="number"
          name="price"
          min={1}
          step={0.1}
          placeholder="Preço"
        />
        <br />
        <button>Comprar</button>
      </form>
    </div>
  );
};
