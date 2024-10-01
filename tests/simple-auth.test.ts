import * as anchor from "@coral-xyz/anchor";
import { Program, BN } from "@coral-xyz/anchor";
import { ConfirmOptions, Keypair } from "@solana/web3.js";
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

  let userPubkey = Keypair.generate().publicKey;

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
    expect(authenticationState.nonce.eq(new BN(0))).to.be.true;
  });

  it("should authenticate the user", async () => {
    const tx = await program.methods
      .authenticate(userPubkey)
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
    expect(authenticationState.nonce.eq(new BN(1))).to.be.true; // nonce should increment
  });

  it("should deauthenticate the user", async () => {
    const tx = await program.methods
      .deauthenticate(userPubkey)
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
    expect(authenticationState.nonce.eq(new BN(2))).to.be.true; // nonce should increment again
  });
});
