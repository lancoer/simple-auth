import {
  generateSigner,
  keypairIdentity,
  percentAmount,
} from "@metaplex-foundation/umi";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import {
  createNft,
  findMetadataPda,
  mplTokenMetadata,
  verifyCollectionV1,
} from "@metaplex-foundation/mpl-token-metadata";
import { Connection, clusterApiUrl } from "@solana/web3.js";

import secretKey from "../test-ledger/id.json";

const mintNft = async () => {
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");
  const umi = createUmi(connection);
  const umiKeypair = umi.eddsa.createKeypairFromSecretKey(
    new Uint8Array(secretKey)
  );

  umi.use(keypairIdentity(umiKeypair)).use(mplTokenMetadata());

  const collectionMint = generateSigner(umi);

  try {
    await createNft(umi, {
      mint: collectionMint,
      name: "One Piece NFT",
      symbol: "OPN",
      uri: "https://nftstorage.link/ipfs/bafybeib7j7kxkd5u445oewlttohocyc55t6pjmxyyxwtwp65o4zpbwyxhe",
      updateAuthority: umi.identity.publicKey,
      sellerFeeBasisPoints: percentAmount(5), // 5% royalty
      isCollection: true,
    }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

    console.log("Collection NFT address is:", collectionMint.publicKey);
    console.log("✅ Finished successfully!");

    for (let i = 0; i < 10; i++) {
      // generate mint keypair
      const mint = generateSigner(umi);

      // create and mint NFT
      await createNft(umi, {
        mint,
        name: `OPN #${i}`,
        symbol: "OPN",
        uri: `https://nftstorage.link/ipfs/bafybeib7j7kxkd5u445oewlttohocyc55t6pjmxyyxwtwp65o4zpbwyxhe/${i}.json`,
        updateAuthority: umi.identity.publicKey,
        sellerFeeBasisPoints: percentAmount(5),
        collection: {
          key: collectionMint.publicKey,
          verified: false,
        },
      }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

      console.log("Mint NFT", mint.publicKey);

      const metadata = findMetadataPda(umi, { mint: mint.publicKey });

      await verifyCollectionV1(umi, {
        metadata,
        collectionMint: collectionMint.publicKey,
        authority: umi.identity,
      }).sendAndConfirm(umi, { send: { commitment: "finalized" } });

      console.log("✅ Verified!");
    }
  } catch (error) {
    console.error("Error creating NFT: ", error);
  }
};

mintNft();
