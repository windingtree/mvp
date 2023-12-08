import { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Stack,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { Info as InfoIcon } from '@mui/icons-material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useForm, validateConstraint } from '@conform-to/react';
import {
  generateMnemonic,
  supplierId as createSupplierId,
  deriveAccount,
} from '@windingtree/sdk-utils';
import { copyToClipboard } from '@windingtree/sdk-react/utils';
import { randomSalt, entitiesRegistryABI, kinds } from '@windingtree/contracts';
import { ConfigActions, useConfig } from '@windingtree/sdk-react/providers';
import type { Address, Hash } from 'viem';
import {
  contractsConfig,
  targetChain,
  serverIp,
  serverPort,
  serverId,
} from 'mvp-shared-files';
import { CustomConfig } from '../main.js';

const InfoBlock = () => (
  <List
    sx={{
      border: '1px solid orange',
      padding: 2,
      marginTop: 4,
      marginBottom: 4,
    }}
  >
    <ListItem>
      <ListItemIcon>
        <InfoIcon color="info" />
      </ListItemIcon>
      <ListItemText>
        Generated mnemonic will not be persisted for security reasons.
      </ListItemText>
    </ListItem>
    <Divider variant="inset" component="li" />
    <ListItem>
      <ListItemIcon>
        <InfoIcon color="info" />
      </ListItemIcon>
      <ListItemText>
        If you refresh the application page or switch to another page, you will
        lose generated mnemonic.
      </ListItemText>
    </ListItem>
  </List>
);

interface RegistrationSchema {
  signerMnemonic: string;
  salt: string;
}

export const SupplierRegister = () => {
  const { supplierId, setConfig } = useConfig<CustomConfig>();
  const { open: openWalletConnect } = useWeb3Modal();
  const account = useAccount();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [signerMnemonic, setSignerMnemonic] = useState<string>('');
  const [signerAccount, setSignerAccount] = useState<string>('');
  const [salt, setSalt] = useState<Hash | undefined>();
  const [newSupplierId, setSupplierId] = useState<string | undefined>();
  const [nodeEnv, setNodeEnv] = useState<string | undefined>();

  const { data, isLoading, isSuccess, write } = useContractWrite({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'register',
  });

  const [form, fieldset] = useForm<RegistrationSchema>({
    onValidate(context) {
      const submission = validateConstraint(context);

      setDisabled(
        Object.keys(submission.error).length > 0 ||
          !salt ||
          signerAccount === '',
      );

      return submission;
    },
    onSubmit(e, { submission }) {
      e.preventDefault();
      console.log('@@@', submission);

      write({
        args: [kinds.supplier as Hash, salt as Hash, signerAccount as Address],
      });
    },
  });

  useEffect(() => {
    if (Boolean(account.address) && salt) {
      const id = createSupplierId(salt, account.address as Address);
      setSupplierId(() => id);
      setConfig({
        type: ConfigActions.SET_CONFIG,
        payload: {
          supplierId: id,
        },
      });
    } else {
      setConfig({
        type: ConfigActions.SET_CONFIG,
        payload: {
          supplierId: undefined,
        },
      });
    }
  }, [account, salt, setConfig]);

  useEffect(() => {
    if (signerMnemonic) {
      setSignerAccount(() => deriveAccount(signerMnemonic, 0).address);
    } else {
      setSignerAccount(() => '');
    }
  }, [signerMnemonic]);

  useEffect(() => {
    if (isSuccess) {
      setNodeEnv(
        () => `ENTITY_SIGNER_MNEMONIC=${signerMnemonic}
ENTITY_ID=${newSupplierId}
ENTITY_OWNER_ADDRESS=${account.address}
VITE_CHAIN=${targetChain}
VITE_SERVER_IP=${serverIp}
VITE_SERVER_PORT=${serverPort}
VITE_SERVER_ID=${serverId}
`,
      );
    } else {
      setNodeEnv(undefined);
    }
  }, [account.address, isSuccess, signerMnemonic, newSupplierId]);

  return (
    <>
      <form {...form.props}>
        <Stack spacing={4}>
          <header>
            <Typography variant="h5" component="h1">
              Supplier's Entity Registration
            </Typography>
            <Typography variant="subtitle1" color="GrayText">
              Using this form you are able to configure and register the
              supplier's entity in the WindingTree Market Protocol
              smart-contract
            </Typography>
          </header>
          <Box>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography variant="h6">Supplier's account:</Typography>
              {account.address ? (
                <Typography>{account.address}</Typography>
              ) : (
                <Button
                  variant="text"
                  onClick={() => openWalletConnect()}
                  disabled={isLoading}
                >
                  Connect wallet
                </Button>
              )}
            </Stack>
            <Typography variant="subtitle1" color="GrayText">
              This account owns the entity and its funds and can change the
              configuration of the entity in the smart contract.
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6">Signer configuration</Typography>
            <Typography variant="subtitle1" color="GrayText">
              This account is dedicated to signing the supplier's offers and
              making offer-related actions like claims, check-in and check-out.
            </Typography>
            <Typography variant="subtitle1" color="GrayText">
              Signer's account has no access to funds and is not able to change
              the entity configuration.
            </Typography>
          </Box>
          <TextField
            label="Signer's wallet mnemonic"
            type="text"
            name="signerMnemonic"
            placeholder="Press `Generate` button or paste an externally generated mnemonic here"
            multiline
            rows={2}
            required
            value={signerMnemonic}
            onChange={(e) => setSignerMnemonic(e.target.value)}
            error={Boolean(fieldset.signerMnemonic.error)}
            helperText={fieldset.signerMnemonic.error}
            disabled={isLoading || isSuccess}
          />
          <Stack direction="row" spacing={2}>
            <Button
              variant="contained"
              size="small"
              onClick={() => setSignerMnemonic(() => generateMnemonic())}
              disabled={isLoading || isSuccess}
            >
              Generate mnemonic
            </Button>
            <Button
              variant="text"
              color="secondary"
              size="small"
              disabled={!Boolean(signerMnemonic) || isLoading}
              onClick={() => copyToClipboard(signerMnemonic)}
            >
              Copy mnemonic to clipboard
            </Button>
          </Stack>
          <InfoBlock />
          <Box>
            <Typography variant="h6">Entity account salt</Typography>
            <Typography variant="subtitle1" color="GrayText">
              This unique string is required for the entity registration flow.
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">Salt:</Typography>
            {salt ? (
              <Typography>{salt}</Typography>
            ) : (
              <Button
                variant="contained"
                size="small"
                onClick={() => setSalt(() => randomSalt())}
                disabled={isLoading}
              >
                Generate salt
              </Button>
            )}
          </Stack>
          <Box>
            <Typography variant="h6">Supplier's Entity Id</Typography>
            <Typography variant="subtitle1" color="GrayText">
              Unique Id that identifies the supplier entity in the protocol
            </Typography>
          </Box>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography variant="h6">Supplier Id:</Typography>
            {salt ? (
              <Typography>{newSupplierId}</Typography>
            ) : (
              <Typography color="GrayText">
                Generate salt first (wallet also must be connected)
              </Typography>
            )}
          </Stack>
          <Divider />
          <Button
            type="submit"
            variant="contained"
            disabled={disabled || isLoading || isSuccess}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Typography>Send registration transaction</Typography>
              {isLoading && <CircularProgress size={16} />}
            </Stack>
          </Button>
        </Stack>
        {isSuccess && (
          <Stack spacing={4} sx={{ marginTop: 4 }}>
            <Box>
              <Typography variant="h6">Signer's Node Configuration</Typography>
              <Typography variant="subtitle1" color="GrayText">
                Copy the content of the following <strong>.env</strong> file to
                you Node's environment
              </Typography>
            </Box>
            <TextField
              label=".env"
              type="text"
              name="nodeEnv"
              multiline
              rows={8}
              value={nodeEnv}
            />
            <Stack direction="row" spacing={2}>
              <Button
                variant="text"
                color="secondary"
                size="small"
                disabled={!Boolean(nodeEnv) || !isSuccess}
                onClick={() => copyToClipboard(nodeEnv || '')}
              >
                Copy <strong>.env</strong>&nbsp;to clipboard
              </Button>
            </Stack>
          </Stack>
        )}
      </form>
    </>
  );
};
