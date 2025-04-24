import { useEffect, useState } from "react";

import { ByteArray, createPublicClient, createWalletClient, encodeAbiParameters, encodeFunctionData, fallback, http, HttpTransport, nonceManager, PublicClient } from "viem";
import { jsonRpc, createNonceManager } from "viem/nonce";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getGas } from "@/web3/gas";
import { skaleCalypsoTestnet, skaleNebulaTestnet } from "viem/chains";
const chainId = skaleCalypsoTestnet.id;

const pk = generatePrivateKey();
const account = privateKeyToAccount(pk);
let nonce = 0;

(async() => {
    await getGas(account);
})();

const wallet = createWalletClient({
    transport: http(),
    chain: skaleCalypsoTestnet,
});

// const client = createPublicClient({
//     chain: skaleCalypsoTestnet,
//     transport: fallback([
//         http("https://staging-0.skalenodes.com:10072"),
//         // http("https://staging-1.skalenodes.com:10072"),
//         // http("https://staging-2.skalenodes.com:10072"),
//         // http("https://staging-3.skalenodes.com:10072"),
//     ]),
//     pollingInterval: 250
// });

const abi = [
    {
        "type": "function",
        "name": "move",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "startGame",
        "inputs": [],
        "outputs": [],
        "stateMutability": "nonpayable"
    }
];

const functiondata = encodeFunctionData({
    abi,
    functionName: "move"
});

export async function execute() {
    try {
        const rs = await wallet.sendTransaction({
            account,
            to: "0xDF51D361095F0F2075C191dc463A7ced6369c841",
            data: functiondata,
            chain: skaleCalypsoTestnet,
            type: "legacy",
            gasPrice: BigInt(100_000),
            nonce: nonce++
        });

        console.log("Res: ", rs);
    } catch (ignore) {}
}