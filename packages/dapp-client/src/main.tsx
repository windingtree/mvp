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
import { RequestQuery, contractsConfig } from 'mvp-shared-files';
import {
  wcProjectId,
  serverAddress,
  requestExpiration,
  nodeTopic,
  chain,
  targetChain,
} from './config.js';
import type { OfferOptions } from '@windingtree/mvp-node/types';
import {
  LocalStorage,
  createInitializer,
} from '@windingtree/sdk-storage/local';
import { SearchProvider } from './providers/SearchProvider/index.js';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { createLogger } from '@windingtree/sdk-logger';

const logger = createLogger('Main');

const wagmiConfig = defaultWagmiConfig({
  chains: [chain],
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
  chains: [chain],
  projectId: wcProjectId,
});

const themeOptions: ThemeOptions = {
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundImage: 'url(/assets/images/background.webp)',
          backgroundSize: '100% 100%',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center center',
          backgroundAttachment: 'fixed',
        },
      },
    },
  },
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
  <WalletProvider targetChain={chain}>
    <ConfigProvider>
      <WagmiConfig config={wagmiConfig}>
        <ContractsProvider contractsConfig={contractsConfig[targetChain]}>
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
                chain={chain}
                contracts={contractsConfig[targetChain]}
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
