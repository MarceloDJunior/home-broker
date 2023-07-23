import { HttpClient } from '@/app/http-client';
import { isHomeBrokerClosed } from '@/app/utils';
import { NextRequest, NextResponse } from 'next/server';

type RouteParams = {
  params: {
    assetId: string;
  };
};

export async function GET(request: NextRequest, { params }: RouteParams) {
  const oneHour = 60 * 60;
  const response = await HttpClient.get(`/assets/${params.assetId}`, {
    revalidate: isHomeBrokerClosed() ? oneHour : 5,
  });
  return NextResponse.json(response);
}
