import { revalidateTag } from 'next/cache';
import { HttpClient } from '../http-client';
import { Button, Label, TextInput } from './flowbite-components';

const initTransaction = async (formData: FormData) => {
  'use server';
  const shares = Number(formData.get('shares'));
  const price = Number(formData.get('price'));
  const assetId = formData.get('asset_id');
  const walletId = formData.get('wallet_id');
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
  revalidateTag(`orders-wallet-${walletId}`);
  return response;
};

type Props = {
  assetId: string;
  walletId: string;
  type: 'BUY' | 'SELL';
};

export const OrderForm = ({ assetId, walletId, type }: Props) => {
  return (
    <div>
      <form action={initTransaction}>
        <input name="asset_id" type="hidden" defaultValue={assetId} />
        <input name="wallet_id" type="hidden" defaultValue={walletId} />
        <input name="type" type="hidden" defaultValue={type} />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="shares" value="Shares" />
          </div>
          <TextInput
            id="shares"
            name="shares"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
        <div>
          <div className="mb-2 block">
            <Label htmlFor="price" value="Price $" />
          </div>
          <TextInput
            id="price"
            name="price"
            required
            type="number"
            min={1}
            step={1}
            defaultValue={1}
          />
        </div>
        <br />
        <Button type="submit" color={type === 'BUY' ? 'green' : 'red'}>
          Confirm {type === 'BUY' ? 'purchase' : 'sale'}
        </Button>
      </form>
    </div>
  );
};
