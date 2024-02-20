import { createRoot } from 'react-dom/client';
import { App } from './App.js';
import {
  AppConfig,
  WalletProvider,
  ConfigProvider,
  ContractsProvider,
  ClientProvider,
  RequestsManagerProvider,
  DealsManagerProvider,
} from '@windingtree/sdk-react/providers';
import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import {
  RequestQuery,
  contractsConfig,
  serverAddress,
  wcProjectId,
} from 'mvp-shared-files';
import type { OfferOptions } from '@windingtree/mvp-node/types';
import { hardhat, gnosisChiado } from 'viem/chains';
import {
  LocalStorage,
  createInitializer,
} from '@windingtree/sdk-storage/local';
import { SearchProvider } from './providers/SearchProvider/index.js';
import { requestExpiration, nodeTopic } from './config.js';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('Main');

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

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'light',
    primary: {
      main: '#00DA95',
    },
    secondary: {
      main: '#21BDE2',
    },
  },
};

const clientTheme = createTheme(themeOptions);

export interface CustomConfig extends AppConfig {
  //
}

window.addEventListener('unhandledrejection', (event) => {
  event.preventDefault();
  event.stopPropagation();
  logger.trace('Unhandled error event', event);
});

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <WalletProvider targetChain={targetChain}>
    <ConfigProvider>
      <WagmiConfig config={wagmiConfig}>
        <ContractsProvider contractsConfig={contractsConfig}>
          <ClientProvider<RequestQuery, OfferOptions>
            serverAddress={serverAddress}
          >
            <RequestsManagerProvider<RequestQuery, OfferOptions, LocalStorage>
              storageInitializer={createInitializer({
                session: false, // session or local storage
              })}
              prefix={'mvp_'}
            >
              <DealsManagerProvider<RequestQuery, OfferOptions, LocalStorage>
                storageInitializer={createInitializer({
                  session: false, // session or local storage
                })}
                prefix={'mvp_'}
                checkInterval={'5s'}
                chain={targetChain}
                contracts={contractsConfig}
              >
                <SearchProvider topic={nodeTopic} expire={requestExpiration}>
                  <ThemeProvider theme={clientTheme}>
                    <CssBaseline />
                    <App />
                  </ThemeProvider>
                </SearchProvider>
              </DealsManagerProvider>
            </RequestsManagerProvider>
          </ClientProvider>
        </ContractsProvider>
      </WagmiConfig>
    </ConfigProvider>
  </WalletProvider>,
);
