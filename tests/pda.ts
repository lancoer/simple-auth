import * as anchor from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

export const AUTHENTICATION_STATE_SEED = Buffer.from(
  anchor.utils.bytes.utf8.encode("authentication_state")
);

export const getAuthenticationStateAddress = (
  user: PublicKey,
  programId: PublicKey
): [PublicKey, number] => {
  const [address, bump] = PublicKey.findProgramAddressSync(
    [AUTHENTICATION_STATE_SEED, user.toBuffer()],
    programId
  );

  return [address, bump];
};
