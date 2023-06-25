import humps from 'humps';

const baseUrl = 'http://localhost:8000';

const defaultOptions: RequestInit = {
  headers: {
    'Content-type': 'application/json',
  },
  next: {
    revalidate: 10,
  },
};

type Options = {
  tag: string;
};

export class HttpClient {
  static async get(url: string, options?: Options): Promise<any> {
    const customOptions = { ...defaultOptions };
    if (options?.tag && customOptions.next) {
      customOptions.next.tags = [options.tag];
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
