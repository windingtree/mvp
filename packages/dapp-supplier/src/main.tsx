import { createRoot } from 'react-dom/client';
import { Hash } from 'viem';
import { App } from './App.js';
import {
  AppConfig,
  ConfigProvider,
  NodeProvider,
  ContractsProvider,
} from '@windingtree/sdk-react/providers';
import { WagmiConfig } from 'wagmi';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { contractsConfig } from 'mvp-shared-files';
import { wcProjectId } from './config.js';
import { AirplaneConfiguration } from './components/Airplanes/type.js';
import { createTheme, ThemeProvider, ThemeOptions } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { chain, targetChain } from './config.js';

const wagmiConfig = defaultWagmiConfig({
  chains: [chain],
  projectId: wcProjectId,
  metadata: {
    name: 'WTMP',
    description: 'WindingTree Market Protocol MVP',
    url: 'https://',
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
  supplierId?: Hash;
  ipfsProjectId?: string;
  ipfsServerKey?: string;
  cacheAirplane: AirplaneConfiguration;
  role?: 'admin' | 'manager';
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
    <NodeProvider>
      <WagmiConfig config={wagmiConfig}>
        <ContractsProvider contractsConfig={contractsConfig[targetChain]}>
          <ThemeProvider theme={clientTheme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </ContractsProvider>
      </WagmiConfig>
    </NodeProvider>
  </ConfigProvider>,
);
