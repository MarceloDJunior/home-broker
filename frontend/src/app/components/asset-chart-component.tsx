'use client';

import humps from 'humps';
import { MutableRefObject, useRef } from 'react';
import useSWR from 'swr';
import useSWRSubscription, { SWRSubscriptionOptions } from 'swr/subscription';
import { apiBaseUrl, HttpClient } from '../http-client';
import { Asset, AssetDaily } from '../models';
import { ChartComponent, ChartComponentRef } from './chart-component';

type Props = {
  assetId: string;
};

export const AssetChartComponent = ({ assetId }: Props) => {
  const chartRef = useRef<ChartComponentRef>(null);

  // TODO: Implement on the next API to work with cache
  const { data: asset, mutate } = useSWR<Partial<Asset>>(
    `/assets/${assetId}`,
    HttpClient.get,
    {
      fallbackData: {
        id: assetId,
        price: 0,
      },
    },
  );

  const { data: updatedAssets } = useSWRSubscription(
    `${apiBaseUrl}/assets/${assetId}/daily/events`,
    (path, { next }: SWRSubscriptionOptions) => {
      const eventSource = new EventSource(path);
      eventSource.addEventListener('asset-daily-created', async (event) => {
        const assetDailyCreated = humps.camelizeKeys(
          JSON.parse(event.data),
        ) as AssetDaily;

        chartRef.current?.update({
          date: assetDailyCreated.date,
          value: assetDailyCreated.price,
        });

        await mutate(
          {
            id: assetDailyCreated.id,
            price: assetDailyCreated.price,
          },
          false,
        );

        next(null, assetDailyCreated);
      });

      eventSource.onerror = (error) => {
        console.error(error);
        eventSource.close();
      };
      return () => {
        console.log('close event source');
        eventSource.close();
      };
    },
  );

  return (
    <ChartComponent header={`${assetId} - R$ ${asset?.price}`} ref={chartRef} />
  );
};
