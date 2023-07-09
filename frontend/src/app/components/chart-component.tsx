'use client';

import {
  ColorType,
  ISeriesApi,
  createChart,
  UTCTimestamp,
} from 'lightweight-charts';
import {
  MutableRefObject,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
} from 'react';

const colors = {
  backgroundColor: 'rgba(17 24 39)',
  lineColor: '#2962FF',
  textColor: 'white',
  areaTopColor: '#2962FF',
  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
};

type ChartRef = {
  _api?: any;
  api: () => any;
  free: () => void;
};

type ChartData = { date: string; value: number };

export interface ChartComponentRef {
  update: (data: ChartData) => void;
  setData: (data: ChartData[]) => void;
}

const chartOptions = {
  layout: {
    background: { type: ColorType.Solid, color: colors.backgroundColor },
    textColor: colors.textColor,
  },
  grid: {
    vertLines: {
      color: 'rgba(197, 203, 206, 0.3)',
    },
    horzLines: {
      color: 'rgba(197, 203, 206, 0.3)',
    },
  },
};

type Props = { header: string; data?: any[] };

export const ChartComponent = forwardRef<ChartComponentRef, Props>(
  (props, ref) => {
    const chartContainerRef = useRef() as MutableRefObject<HTMLDivElement>;
    const chartRef = useRef<ChartRef>({
      api() {
        if (!this._api) {
          this._api = createChart(chartContainerRef.current, {
            ...chartOptions,
            width: chartContainerRef.current.clientWidth,
            height: chartContainerRef.current.clientHeight,
            timeScale: {
              visible: true,
              timeVisible: true,
            },
          });
          this._api.timeScale().fitContent();
        }
        return this._api;
      },
      free() {
        if (this._api) {
          this._api.remove();
        }
      },
    });
    const seriesRef = useRef() as MutableRefObject<ISeriesApi<'Area'>>;

    useImperativeHandle(ref, () => ({
      update: (data: ChartData) => {
        seriesRef.current.update({
          time: (new Date(data.date).getTime() / 1000) as UTCTimestamp,
          value: data.value,
        });
      },
      setData: (data: ChartData[]) => {
        seriesRef.current.setData(
          data.map((entry) => ({
            time: (new Date(entry.date).getTime() / 1000) as UTCTimestamp,
            value: entry.value,
          })),
        );
      },
    }));

    useEffect(() => {
      seriesRef.current = chartRef.current.api().addAreaSeries({
        lineColor: colors.lineColor,
        topColor: colors.areaTopColor,
        bottomColor: colors.areaBottomColor,
      });
      // seriesRef.current.setData([
      //   { time: '2018-12-22', value: 32.51 },
      //   { time: '2018-12-23', value: 31.11 },
      //   { time: '2018-12-24', value: 27.02 },
      //   { time: '2018-12-25', value: 27.32 },
      //   { time: '2018-12-26', value: 25.17 },
      //   { time: '2018-12-27', value: 28.89 },
      //   { time: '2018-12-28', value: 25.46 },
      //   { time: '2018-12-29', value: 23.92 },
      //   { time: '2018-12-30', value: 22.68 },
      //   { time: '2018-12-31', value: 22.67 },
      // ]);
    }, []);

    useLayoutEffect(() => {
      const currentRef = chartRef.current;
      const chart = currentRef.api();

      const handleResize = () => {
        chart.applyOptions({
          ...chartOptions,
          width: chartContainerRef.current.clientWidth,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        chart.remove();
      };
    }, []);

    useLayoutEffect(() => {
      const currentRef = chartRef.current;
      currentRef.api();
    }, []);

    useLayoutEffect(() => {
      const currentRef = chartRef.current;
      currentRef.api().applyOptions(chartOptions);
    }, []);

    return (
      <div className="flex-grow relative" ref={chartContainerRef}>
        <article className="absolute top-0 left-0 z-50 format format-invert">
          <div className="text-3xl font-bold text-white">{props.header}</div>
        </article>
      </div>
    );
  },
);

ChartComponent.displayName = 'ChartComponent';
