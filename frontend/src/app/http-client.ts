import humps from 'humps';

const baseUrl = 'http://host.docker.internal:3000';

const defaultOptions: RequestInit = {
  headers: {
    'Content-type': 'application/json',
  },
  // cache: 'no-store', // disable caching
  next: {
    revalidate: 10,
  },
};

type Options = {
  tag: string;
  revalidate: number;
};

export class HttpClient {
  static async get(url: string, options?: Partial<Options>): Promise<any> {
    const customOptions = { ...defaultOptions };
    if (options?.tag && customOptions.next) {
      customOptions.next.tags = [options.tag];
    }
    if (options?.revalidate && customOptions.next) {
      customOptions.next.revalidate = options.revalidate;
    }
    const response = await fetch(baseUrl + url, customOptions);
    const json = await response.json();
    return humps.camelizeKeys(json);
  }

  static async post(url: string, body: any): Promise<any> {
    const response = await fetch(baseUrl + url, {
      ...defaultOptions,
      method: 'POST',
      body,
    });
    const json = await response.json();
    return humps.camelizeKeys(json);
  }
}
