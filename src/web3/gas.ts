import { Account, Address, createPublicClient, http, HttpTransport, WalletClient } from "viem";
import mineGasForTransaction from "./miner";
import { skaleCalypsoTestnet, skaleNebulaTestnet } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";

const contractAddress: Address = "0x62Fe932FF26e0087Ae383f6080bd2Ed481bA5A8A"; // "0x000E9c53C4e2e21F5063f2e232d0AA907318dccb";
const client = createPublicClient({
    chain: skaleCalypsoTestnet,
    transport: http()
});

export async function getGas(account: Account) {
    const pk = generatePrivateKey();
    const burnerAccount = privateKeyToAccount(pk);
    const nonce = await client.getTransactionCount({ address: burnerAccount.address });
    const { gasPrice } = await mineGasForTransaction(
        nonce,
        75_000,
        burnerAccount.address
    );

    const signedTx = await burnerAccount.signTransaction({
        to: contractAddress,
        gasPrice: gasPrice,
        gas: BigInt(75_000),
        data: `0x0c11dedd000000000000000000000000${account.address.substring(2)}`,
        chainId: skaleCalypsoTestnet.id
    });

    const res = await client.sendRawTransaction({
        serializedTransaction: signedTx
    });

    console.log("Gas Fill Up", res);
    
    return true;
}