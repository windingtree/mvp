import 'dotenv/config';
import { Address, Chain, Hash, Hex } from 'viem';
import { targetChain } from 'mvp-shared-files';
import { gnosisChiado, hardhat } from 'viem/chains';

class Config {
  private _signerMnemonic: string | undefined;
  private _signerPk: Hex | undefined;
  private _supplierId: `0x${string}` | undefined;
  private _entityOwnerAddress: `0x${string}` | undefined;
  private _cors: string[] | undefined;
  private _chain: Chain | undefined;
  private _offerGap: number | undefined;

  public init() {
    this.setSignerMnemonicFromConfig();
    this.setSignerPkFromConfig();
    this.setSupplierIdFromConfig();
    this.setEntityOwnerAddressFromConfig();
    this.setChainFromConfig();
    this.setCorsFromConfig();
    this.setOfferGapFromConfig();
  }

  private setSignerMnemonicFromConfig() {
    /**
     * The supplier signer credentials
     */
    const signerMnemonic = process.env.ENTITY_SIGNER_MNEMONIC;
    if (!signerMnemonic) {
      throw new Error('Either signerMnemonic must be provided with env');
    }
    this._signerMnemonic = signerMnemonic;
  }

  private setSignerPkFromConfig() {
    // Ignore Pk configuration if mnemonic is set already
    if (this._signerMnemonic) {
      return;
    }

    /**
     * The supplier signer credentials
     */
    const signerPk = process.env.ENTITY_SIGNER_PK as Hex;
    if (!signerPk) {
      throw new Error('Either signerPk must be provided with env');
    }
    this._signerPk = signerPk;
  }

  private setSupplierIdFromConfig() {
    /**
     * Supplier Id is hashed combination of a random salt string and
     * an address of the supplier owner account address.
     * Supplier must register his entity in the EntitiesRegistry
     */
    const supplierId = process.env.ENTITY_ID as Hash;

    if (!supplierId) {
      throw new Error('Entity Id must be provided with EXAMPLE_ENTITY_ID env');
    }

    this._supplierId = supplierId;
  }

  private setEntityOwnerAddressFromConfig() {
    /**
     * The Ethereum account address of the entity owner (supplier)
     */
    const entityOwnerAddress = process.env.ENTITY_OWNER_ADDRESS as Address;

    if (!entityOwnerAddress) {
      throw new Error(
        'Entity owner address must be provided with EXAMPLE_ENTITY_OWNER_ADDRESS env',
      );
    }

    this._entityOwnerAddress = entityOwnerAddress;
  }

  private setCorsFromConfig() {
    /**
     * Parse CORS configuration
     */
    this._cors = process.env.VITE_SERVER_CORS
      ? process.env.VITE_SERVER_CORS.split(';').map((uri) => uri.trim())
      : ['*'];
  }

  private setChainFromConfig() {
    /**
     * Chain config
     */
    this._chain = targetChain === 'hardhat' ? hardhat : gnosisChiado;
  }

  private setOfferGapFromConfig() {
    const offerGap = Number(process.env.ENTITY_OFFER_GAP);

    if (!offerGap) {
      throw new Error(
        'Entity offer gap must be provided with ENTITY_OFFER_GAP env',
      );
    }

    this._offerGap = offerGap;
  }

  get signerMnemonic(): string | undefined {
    return this._signerMnemonic;
  }

  get signerPk(): Hex | undefined {
    return this._signerPk;
  }

  get supplierId(): `0x${string}` {
    if (!this._supplierId) {
      throw new Error('Entity Id must be provided with EXAMPLE_ENTITY_ID env');
    }
    return this._supplierId;
  }

  get entityOwnerAddress(): `0x${string}` {
    if (!this._entityOwnerAddress) {
      throw new Error(
        'Entity owner address must be provided with EXAMPLE_ENTITY_OWNER_ADDRESS env',
      );
    }
    return this._entityOwnerAddress;
  }

  get cors(): string[] {
    if (!this._cors) {
      throw new Error('Cors config error');
    }
    return this._cors;
  }

  get chain(): Chain {
    if (!this._chain) {
      throw new Error('Chain config error');
    }
    return this._chain;
  }

  get offerGap(): number {
    if (!this._offerGap) {
      throw new Error(
        'Entity offer gap must be provided with ENTITY_OFFER_GAP env',
      );
    }

    return this._offerGap;
  }
}

export const config: Config = new Config();
