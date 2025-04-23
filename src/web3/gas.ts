import { Account, Address, createPublicClient, http, HttpTransport, WalletClient } from "viem";
import mineGasForTransaction from "./miner";
import { skaleNebulaTestnet } from "viem/chains";

const contractAddress: Address = "0x000E9c53C4e2e21F5063f2e232d0AA907318dccb";
const client = createPublicClient({
    chain: skaleNebulaTestnet,
    transport: http()
});

export async function getGas(account: Account) {
    const nonce = await client.getTransactionCount({ address: account.address });
    const { gasPrice } = await mineGasForTransaction(
        nonce,
        75_000,
        account.address
    );

    const signedTx = await account.signTransaction({
        to: contractAddress,
        gasPrice: gasPrice,
        gas: BigInt(75_000),
        data: `0x0c11dedd000000000000000000000000${account.address.substring(2)}`
    });

    const res = await client.sendRawTransaction({
        serializedTransaction: signedTx
    });

    console.log("Gas Fill Up", res);
}