import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SimpleAuth } from "../target/types/simple_auth";

describe("simple-auth", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SimpleAuth as Program<SimpleAuth>;

  it("Is initialized!", async () => {
    // Add your test here.
    const tx = await program.methods.initialize().rpc();
    console.log("Your transaction signature", tx);
  });
});

import { Program } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import { expect } from "chai";
import {
  AuthenticationAccount,
  IDL,
} from "../target/types/authentication_program"; // Adjust the path as necessary
import {
  createAccount,
  initializeAccount,
  authenticateAccount,
  deauthenticateAccount,
} from "./utils"; // Utility functions for account management

describe("authentication_program", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);
  const program = anchor.workspace.AuthenticationProgram as Program<IDL>;

  let userKeypair: Keypair;
  let authenticationAccountPubkey: PublicKey;

  beforeEach(async () => {
    userKeypair = Keypair.generate();
    authenticationAccountPubkey = await createAccount(provider, userKeypair); // Create a new authentication account
  });

  it("should initialize the authentication account", async () => {
    await initializeAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    );

    const account = await program.account.authenticationAccount.fetch(
      authenticationAccountPubkey
    );

    expect(account.isAuthenticated).to.be.false;
    expect(account.nonce).to.equal(0);
  });

  it("should authenticate the user", async () => {
    await initializeAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    ); // Ensure it's initialized first

    await authenticateAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    );

    const account = await program.account.authenticationAccount.fetch(
      authenticationAccountPubkey
    );

    expect(account.isAuthenticated).to.be.true;
    expect(account.nonce).to.equal(1); // nonce should increment
  });

  it("should deauthenticate the user", async () => {
    await initializeAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    ); // Ensure it's initialized first
    await authenticateAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    ); // Authenticate first

    await deauthenticateAccount(
      provider,
      program,
      authenticationAccountPubkey,
      userKeypair
    );

    const account = await program.account.authenticationAccount.fetch(
      authenticationAccountPubkey
    );

    expect(account.isAuthenticated).to.be.false;
    expect(account.nonce).to.equal(2); // nonce should increment again
  });
});
