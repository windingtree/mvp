import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import {
  AppConfig,
  ConfigProvider,
  ContractsProvider,
} from '@windingtree/sdk-react/providers';
import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { contractsConfig, wcProjectId } from 'mvp-shared-files';
import { hardhat, gnosisChiado } from 'viem/chains';

export const targetChain =
  import.meta.env.VITE_CHAIN === 'hardhat' ? hardhat : gnosisChiado;

const wagmiConfig = defaultWagmiConfig({
  chains: [targetChain],
  projectId: wcProjectId,
  metadata: {
    name: 'WTMP',
    description: 'WindingTree Market Protocol MVP',
    url: 'http://',
    icons: [
      'https://images.squarespace-cdn.com/content/v1/643e7f29524ccc63e86afd69/1681817436348-JRTSZFCHD93I5T4BQM24/WTLOGO.png?format=1500w',
    ],
  },
});

createWeb3Modal({
  wagmiConfig,
  chains: [targetChain],
  projectId: wcProjectId,
});

export interface CustomConfig extends AppConfig {
  //
}

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  event.stopPropagation();
  // eslint-disable-next-line no-console
  console.log('Unhandled error event', event);
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <ConfigProvider>
    <WagmiConfig config={wagmiConfig}>
      <ContractsProvider contractsConfig={contractsConfig}>
        <App />
      </ContractsProvider>
    </WagmiConfig>
  </ConfigProvider>,
);
