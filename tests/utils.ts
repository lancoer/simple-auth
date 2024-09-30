import { Program } from "@project-serum/anchor";
import { Keypair } from "@solana/web3.js";

export async function createAccount(
  provider: anchor.AnchorProvider,
  userKeypair: Keypair
) {
  const authenticationAccount = Keypair.generate();

  // Create the account on-chain
  const tx = await provider.sendAndConfirm(
    program.transaction.initialize({
      accounts: {
        authenticationAccount: authenticationAccount.publicKey,
        payer: userKeypair.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [userKeypair, authenticationAccount],
    })
  );

  return authenticationAccount.publicKey;
}

export async function initializeAccount(
  provider: anchor.AnchorProvider,
  program: Program<IDL>,
  authenticationPublicKey: PublicKey,
  userKeypair: Keypair
) {
  await program.rpc.initialize({
    accounts: {
      authenticationAccount: authenticationPublicKey,
      payer: userKeypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId,
    },
    signers: [userKeypair],
  });
}

export async function authenticateAccount(
  provider: anchor.AnchorProvider,
  program: Program<IDL>,
  authenticationPublicKey: PublicKey,
  userKeypair: Keypair
) {
  await program.rpc.authenticate({
    accounts: {
      authenticationAccount: authenticationPublicKey,
      payer: userKeypair.publicKey,
    },
    signers: [userKeypair],
  });
}

export async function deauthenticateAccount(
  provider: anchor.AnchorProvider,
  program: Program<IDL>,
  authenticationPublicKey: PublicKey,
  userKeypair: Keypair
) {
  await program.rpc.deauthenticate({
    accounts: {
      authenticationAccount: authenticationPublicKey,
      payer: userKeypair.publicKey,
    },
    signers: [userKeypair],
  });
}
