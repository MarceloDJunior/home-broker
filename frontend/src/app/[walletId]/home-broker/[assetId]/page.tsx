import { MyOrders } from '@/app/components/my-orders';
import { OrderForm } from '@/app/components/order-form';

type PageProps = {
  params: {
    walletId: string;
    assetId: string;
  };
};

const HomeBrokerPage = async ({ params }: PageProps) => {
  return (
    <div>
      <h1>Home broker</h1>
      <div className="flex flex-row ">
        <div className="flex flex-col">
          <div>
            <OrderForm assetId={params.assetId} walletId={params.walletId} />
          </div>
          <div>
            {/* @ts-expect-error */}
            <MyOrders walletId={params.walletId} />
          </div>
        </div>
        <div>grafico</div>
      </div>
    </div>
  );
};

export default HomeBrokerPage;
