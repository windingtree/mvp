import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useContractWrite, useWaitForTransaction } from 'wagmi';
import { useForm, validateConstraint } from '@conform-to/react';
import {
  generateMnemonic,
  supplierId as createSupplierId,
  deriveAccount,
} from '@windingtree/sdk-utils';
import { copyToClipboard, centerEllipsis } from '@windingtree/sdk-react/utils';
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
import { CustomConfig } from '../../main.js';

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
      <ListItemText>
        <Alert severity="warning">
          Generated mnemonic will not be persisted for security reasons.
        </Alert>
      </ListItemText>
    </ListItem>
    <ListItem>
      <ListItemText>
        <Alert severity="warning">
          If you refresh the application page or switch to another page, you
          will lose generated mnemonic.
        </Alert>
      </ListItemText>
    </ListItem>
  </List>
);

interface RegistrationSchema {
  signerMnemonic: string;
  salt: string;
}

export const SupplierRegister = () => {
  const { setConfig } = useConfig<CustomConfig>();
  const { open: openWalletConnect } = useWeb3Modal();
  const account = useAccount();
  const [disabled, setDisabled] = useState<boolean>(false);
  const [signerMnemonic, setSignerMnemonic] = useState<string>('');
  const [signerAccount, setSignerAccount] = useState<string>('');
  const [salt, setSalt] = useState<Hash | undefined>();
  const [newSupplierId, setSupplierId] = useState<string | undefined>();
  const [nodeEnv, setNodeEnv] = useState<string | undefined>();
  const [registered, setRegistered] = useState<boolean>(false);

  const {
    data,
    isLoading,
    write,
    error: sendError,
  } = useContractWrite({
    address: contractsConfig.entities.address,
    abi: entitiesRegistryABI,
    functionName: 'register',
    onError(error) {
      console.log('Tx sending error:', error);
    },
    onSuccess(data) {
      console.log('Tx sent:', data);
    },
  });

  const { isLoading: isTxLoading, error: txError } = useWaitForTransaction({
    hash: data?.hash,
    enabled: Boolean(data?.hash),
    onError(error) {
      console.log('Tx error:', error);
    },
    onSuccess(data) {
      setRegistered(true);
      console.log('Tx mined:', data);
    },
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
      const id = createSupplierId(account.address as Address, salt);
      setSupplierId(() => id);
      setConfig({
        type: ConfigActions.SET_CONFIG,
        payload: {
          supplierId: id,
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
    if (registered) {
      setNodeEnv(
        () => `VITE_CHAIN=${targetChain}
VITE_SERVER_IP=${serverIp}
VITE_SERVER_PORT=${serverPort}
VITE_SERVER_ID=${serverId}
VITE_SERVER_CORS=${window.location.origin}
ENTITY_SIGNER_MNEMONIC=${signerMnemonic}
ENTITY_ID=${newSupplierId}
ENTITY_OWNER_ADDRESS=${account.address}
`,
      );
    } else {
      setNodeEnv(undefined);
    }
  }, [account.address, signerMnemonic, newSupplierId, registered]);

  return (
    <form {...form.props}>
      <Stack spacing={4}>
        <Typography variant="h5" component="h1">
          Supplier's Entity Registration
        </Typography>
        <Typography variant="subtitle1" color="GrayText">
          Using this form you are able to configure and register the supplier's
          entity in the WindingTree Market Protocol smart-contract
        </Typography>
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
          onChange={(e) => {
            setRegistered(false);
            setSignerMnemonic(e.target.value);
          }}
          error={Boolean(fieldset.signerMnemonic.error)}
          helperText={fieldset.signerMnemonic.error}
          disabled={isLoading || isTxLoading || registered}
        />
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="small"
            onClick={() =>
              setSignerMnemonic(() => {
                setRegistered(false);
                return generateMnemonic();
              })
            }
            disabled={isLoading || isTxLoading}
          >
            Generate mnemonic
          </Button>
          <Button
            variant="text"
            color="secondary"
            size="small"
            disabled={!Boolean(signerMnemonic) || isLoading || isTxLoading}
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
              onClick={() =>
                setSalt(() => {
                  setRegistered(false);
                  return randomSalt();
                })
              }
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
          disabled={disabled || isLoading || isTxLoading || registered}
        >
          <Stack direction="row" alignItems="center" spacing={2}>
            <Typography>Send registration transaction</Typography>
            {(isLoading || isTxLoading) && (
              <CircularProgress color="inherit" size={16} />
            )}
          </Stack>
        </Button>
        {data?.hash && (
          <Stack direction="row" spacing={2}>
            <Box>
              <Typography>Tx: {centerEllipsis(data.hash)}</Typography>
            </Box>
            <Button
              variant="text"
              color="secondary"
              size="small"
              disabled={!Boolean(nodeEnv) || !registered}
              onClick={() => copyToClipboard(data.hash)}
            >
              Copy Tx hash to clipboard
            </Button>
          </Stack>
        )}
        {sendError && <Alert severity="error">{sendError.message}</Alert>}
        {txError && <Alert severity="error">{txError.message}</Alert>}
        {registered && (
          <>
            <Alert severity="success">
              The entity with id {newSupplierId} has been registered
              successfully
            </Alert>
            <Typography variant="subtitle1" color="GrayText">
              Copy the content of the following <strong>.env</strong> file to
              you Node's environment
            </Typography>
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
                disabled={!Boolean(nodeEnv) || !registered}
                onClick={() => copyToClipboard(nodeEnv || '')}
              >
                Copy <strong>.env</strong>&nbsp;to clipboard
              </Button>
            </Stack>
          </>
        )}
      </Stack>
    </form>
  );
};
