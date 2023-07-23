import { AssetChartComponent } from '@/app/components/asset-chart-component';
import {
  TabsGroup,
  TabsItem,
  Card,
} from '@/app/components/flowbite-components';
import { MyOrders } from '@/app/components/my-orders';
import { OrderForm } from '@/app/components/order-form';
import { HiArrowUp, HiShoppingCart } from '@/app/components/react-icons/hi';
import { SyncOrders } from '@/app/components/sync-orders';

type PageProps = {
  params: {
    walletId: string;
    assetId: string;
  };
};

const HomeBrokerPage = async ({ params }: PageProps) => {
  return (
    <main className="flex flex-grow flex-col container mx-auto px-2 py-5">
      <article className="format format-invert py-3">
        <h1>Home broker - {params.assetId}</h1>
      </article>
      <div className="grid grid-cols-5 flex-grow gap-8 mt-2">
        <div className="col-span-2">
          <div>
            <Card
              theme={{
                root: {
                  children:
                    'flex h-full flex-col justify-center gap-4 py-4 px-2',
                },
              }}
            >
              <TabsGroup aria-label="Default tabs" style="pills">
                <TabsItem active title="Buy" icon={HiShoppingCart}>
                  <OrderForm
                    walletId={params.walletId}
                    assetId={params.assetId}
                    type="BUY"
                  />
                </TabsItem>
                <TabsItem title="Sell" icon={HiArrowUp}>
                  <OrderForm
                    walletId={params.walletId}
                    assetId={params.assetId}
                    type="SELL"
                  />
                </TabsItem>
              </TabsGroup>
            </Card>
          </div>
          <div className="mt-2">
            <Card
              theme={{
                root: {
                  children:
                    'flex h-full flex-col justify-center gap-4 py-4 px-2',
                },
              }}
            >
              <div className="max-h-96 overflow-y-auto overflow-hidden">
                <SyncOrders walletId={params.walletId}>
                  <div className="max-h-96 overflow-y-auto overflow-hidden">
                    {/* @ts-expect-error */}
                    <MyOrders walletId={params.walletId} />
                  </div>
                </SyncOrders>
              </div>
            </Card>
          </div>
        </div>
        <div className="col-span-3 flex flex-grow">
          <AssetChartComponent assetId={params.assetId} />
        </div>
      </div>
    </main>
  );
};

export default HomeBrokerPage;
