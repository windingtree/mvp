import { useMemo } from 'react';
import { useConfig } from '@windingtree/sdk-react/providers';
import axios from 'axios';
import { type CustomConfig } from '../main.js';

export interface IpfsUploadResponse {
  // v1 cid: @see https://docs.ipfs.io/concepts/content-addressing/#identifier-formats
  cid: string;
  // IPFS format address
  ipfs: string;
  // Preferred url with CDN cache for better performance
  fastUrl: string;
  // Preferred url
  ipfsUrl: string;
  // Other working urls: @see https://ipfs.github.io/public-gateway-checker/
  ipfsUrls: string[];
}

export interface IpfsClientOptions {
  url: string;
  ipfsProjectId?: string;
  ipfsServerKey?: string;
}

export class IpfsClient {
  url: string;
  ipfsProjectId: string;
  ipfsServerKey: string;
  error?: string;

  constructor({ url, ipfsProjectId, ipfsServerKey }: IpfsClientOptions) {
    this.url = url;
    this.ipfsProjectId = ipfsProjectId || '';
    this.ipfsServerKey = ipfsServerKey || '';

    if (!Boolean(ipfsProjectId) || !Boolean(ipfsServerKey)) {
      this.error =
        'Project Id and server Id must be defined in the configuration';
    } else {
      this.error = undefined;
    }
  }
  async upload(file: File): Promise<IpfsUploadResponse> {
    const form = new FormData();
    form.append('file', file);

    const res = await axios.post<IpfsUploadResponse>(this.url, form, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      auth: {
        username: this.ipfsProjectId,
        password: this.ipfsServerKey,
      },
    });

    return res.data;
  }
}

export interface UseIpfsHook {
  ipfs: IpfsClient;
  error?: string;
}

export const useIpfs = (): UseIpfsHook => {
  const { ipfsProjectId, ipfsServerKey } = useConfig<CustomConfig>();

  const ipfs = useMemo(
    () =>
      new IpfsClient({
        url: 'https://rpc.particle.network/ipfs/upload',
        ipfsProjectId,
        ipfsServerKey,
      }),
    [ipfsProjectId, ipfsServerKey],
  );

  return {
    ipfs,
    error: ipfs.error,
  };
};
