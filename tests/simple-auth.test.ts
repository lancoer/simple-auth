import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { ConfirmOptions, Keypair, PublicKey } from "@solana/web3.js";
import { expect } from "chai";

import { SimpleAuth } from "../target/types/simple_auth";

import { getAuthenticationStateAddress } from "./pda";

describe("simple-auth", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SimpleAuth as Program<SimpleAuth>;

  const confirmOptions: ConfirmOptions = {
    skipPreflight: true,
  };

  let userPubkey: PublicKey;

  before(async () => {
    const userKeypair = Keypair.generate();
    userPubkey = userKeypair.publicKey;
  });

  it("should initialize the authentication state account", async () => {
    const tx = await program.methods.initialize(userPubkey).rpc(confirmOptions);
    console.log("Initialize transaction signature", tx);

    const [authenticationStateAddress] = getAuthenticationStateAddress(
      userPubkey,
      program.programId
    );
    console.log("Authentication State", authenticationStateAddress);

    const authenticationState = await program.account.authenticationState.fetch(
      authenticationStateAddress
    );

    expect(authenticationState.isAuthenticated).to.be.false;
    expect(authenticationState.nonce).to.equal(0);
  });

  it("should authenticate the user", async () => {
    const tx = await program.methods
      .authenticate()
      .accounts({ user: userPubkey })
      .rpc(confirmOptions);
    console.log("Authenticate transaction signature", tx);

    const [authenticationStateAddress] = getAuthenticationStateAddress(
      userPubkey,
      program.programId
    );
    console.log("Authentication State", authenticationStateAddress);

    const authenticationState = await program.account.authenticationState.fetch(
      authenticationStateAddress
    );

    expect(authenticationState.isAuthenticated).to.be.true;
    expect(authenticationState.nonce).to.equal(1); // nonce should increment
  });

  it("should deauthenticate the user", async () => {
    const tx = await program.methods
      .deauthenticate()
      .accounts({ user: userPubkey })
      .rpc(confirmOptions);
    console.log("Deauthenticate transaction signature", tx);

    const [authenticationStateAddress] = getAuthenticationStateAddress(
      userPubkey,
      program.programId
    );
    console.log("Authentication State", authenticationStateAddress);

    const authenticationState = await program.account.authenticationState.fetch(
      authenticationStateAddress
    );

    expect(authenticationState.isAuthenticated).to.be.false;
    expect(authenticationState.nonce).to.equal(2); // nonce should increment again
  });
});
