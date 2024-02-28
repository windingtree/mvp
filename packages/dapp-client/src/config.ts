import { getEnvVar } from 'mvp-shared-files/utils';
import { Chain } from 'viem';
import { hardhat, gnosisChiado } from 'viem/chains';

export const nodeTopic = getEnvVar('VITE_NODE_TOPIC', 'string');

export const targetChain = getEnvVar('VITE_CHAIN', 'string');

export const chain: Chain = targetChain === 'hardhat' ? hardhat : gnosisChiado;

if (!chain) {
  throw new Error('Invalid targetChain name');
}

export const wcProjectId = getEnvVar('VITE_WC_PROJECT_ID', 'string');

export const serverAddress = getEnvVar('VITE_SERVER_ADDRESS', 'string');

export const requestExpiration = '1h';

export interface Showcase {
  id: string;
  name: string;
  description: string;
  media: {
    thumbnail: string;
    full: string;
  };
}

export const mainShowcase: Showcase[] = [
  {
    id: 'prague',
    name: 'Prague at Dawn',
    description: 'The historic grandeur of Prague awakens with the day.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreia7bicq6coygddddt7otnhnnxs6izbxzvs5uxt5rcbanu6pzvjhpm',
      full: 'https://ipfs.particle.network/bafybeiauxnri6qfpsq4tfpv7anflmxg57s3wwu4b6bqsugf6b4ripzjp7e',
    },
  },
  {
    id: 'lake',
    name: 'Tranquil Waters',
    description: "A serene lake reflects the surrounding forest's peace.",
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreiaoo46mf33572oxckzeug42glxf7kdrobsbtv457h57ammfqwihlm',
      full: 'https://ipfs.particle.network/bafybeid43k6lyzondovmw44zadfoh3g6ejif6t7akhquwzltfyqf3vcufi',
    },
  },
  {
    id: 'hydro',
    name: 'Harnessing the Flow',
    description: 'The might of human ingenuity captured in a dam.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreiejf6z66dl27sddsctprucle6oyr5rrz44yabs5tc2ual26yq5gsq',
      full: 'https://ipfs.particle.network/bafybeihm2de5vqsbwzh53w5hdfrozxshdwvqeex6wx6wlhe4lnwgsnozry',
    },
  },
  {
    id: 'castle',
    name: 'Fairytale Fortress',
    description: "A castle's fairytale silhouette amidst a forest's embrace.",
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreifxuc6wnmyqyhhg3dtqsqw6czyj37j7pqpb5cm4sgekcgmelscaam',
      full: 'https://ipfs.particle.network/bafybeifafbwjz23qy6iry7wlwv6flhedxp7grc74dbj2jg3rfjmk4wubuy',
    },
  },
  {
    id: 'river',
    name: 'Serpentine Flow',
    description: 'A river winds through mountains like a silver ribbon.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreieukljzj3rnyq73woicwoclf6xvni5gdip7y7pxw6kl4f3kpgdxey',
      full: 'https://ipfs.particle.network/bafybeihqhfwbgompd424vdm72nnejqr4lg6yyjrrk66xns4o3dtvylcqzu',
    },
  },
  {
    id: 'fields',
    name: "Nature's Mosaic",
    description: 'A colorful tapestry of rural farmland.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreiewigze2e2swp7uxkikls5mj5522cijxtlnzixmv2t7fyaq7qa524',
      full: 'https://ipfs.particle.network/bafybeigjycqxulfcppiiphj5lqdfrpf7hgszldo5utl52sc7f5e3v6bxyy',
    },
  },
  {
    id: 'mountains',
    name: 'Carpathian Splendor',
    description: 'Sunlight dances through the Carpathian valleys.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreif35yiotzsuvjicsiybam46shbjyfbvfox3kjduzbhh3ps2yrhhce',
      full: 'https://ipfs.particle.network/bafybeicknzqml5xr7nuzfjnzzykctgdy5qkycqdxfb3mjafldhceulnxg4',
    },
  },
  {
    id: 'abandoned',
    name: 'Ghost Town Reclaimed',
    description: "Nature's embrace of an abandoned urban expanse.",
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreidof2xs2tsgyhpaudnrbfnjdzyg6tkzyz4zxgzb4qzulvb3ylwuwq',
      full: 'https://ipfs.particle.network/bafybeiac2kdb3cdhtc4vpzsnqq7yg432e3a25l5zphahlnve7cs5wu6cce',
    },
  },
  {
    id: 'horses',
    name: 'Dawn Stampede',
    description: 'Horses in motion across a misty field at sunrise.',
    media: {
      thumbnail:
        'https://ipfs.particle.network/bafkreidjrepni3ty6qzueyphnvsylb4kweax3bfqdlx5op6yc6mxjtylne',
      full: 'https://ipfs.particle.network/bafybeigyp476eanbvhb6dhsbhkrckh3igleaezd3vs5zoj5no77ijz66xu',
    },
  },
];
