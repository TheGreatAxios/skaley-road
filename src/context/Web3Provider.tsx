import AsyncStorage from "@react-native-async-storage/async-storage";
import * as React from "react";
import Web3Context from "./Web3Context";

import { createWalletClient, Hex, http, HttpTransport, nonceManager, WalletClient } from "viem";
import { skaleNebulaTestnet } from "viem/chains";
import { generatePrivateKey, privateKeyToAccount } from "viem/accounts";
import { getGas } from "@/web3/gas";

const STORAGE_KEY = "@Web3:Wallet";
const SHOULD_REHYDRATE = true;

const defaultState = {
    privateKey: undefined
};

async function cacheAsync(value) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

async function rehydrateAsync() {
    if (!SHOULD_REHYDRATE || !AsyncStorage) {
        return defaultState;
    }
    try {
        const item = await AsyncStorage.getItem(STORAGE_KEY);
        const data = JSON.parse(item);
        return data;
    } catch (ignored) {
        return defaultState;
    }
}

  
export default function Web3Provider({ children }) {

    const [privateKey, setPrivateKey] = React.useState<Hex | undefined>(undefined);
    const [walletClient, setWalletClient] = React.useState<WalletClient<HttpTransport> | undefined>(undefined);
    const [isReady, setIsReady] = React.useState<boolean>(false);

    React.useEffect(() => {
        const parseModulesAsync = async () => {
            try {
                const { privateKey } = await rehydrateAsync();
                console.log("Private Key: ", privateKey);
                setPrivateKey(privateKey);
                setWalletClient(createWalletClient({
                    chain: skaleNebulaTestnet,
                    transport: http(),
                    account: privateKeyToAccount(privateKey, {
                        nonceManager
                    })
                }));
            } catch (ignored) {
                let _pk = generatePrivateKey();
                setPrivateKey(_pk);
                setWalletClient(createWalletClient({
                    chain: skaleNebulaTestnet,
                    transport: http(),
                    account: privateKeyToAccount(_pk, {
                        nonceManager
                    })
                }));
            }
        }

        parseModulesAsync();
    }, []);

    React.useEffect(() => {
        const _getGas = async() => {
            await getGas(privateKeyToAccount(privateKey));
        }

        if (privateKey) {
            _getGas();
        }
    }, [privateKey]);

    async function executeTransaction(gesture: string) : Promise<void> {
        console.log("Gesture: ", gesture);
        console.log("Client: ", walletClient)
        // TODO add tx
        return;
    }

    if (!privateKey) {
        return (
            <p>Loading...</p>
        );
    }

    return (
        <Web3Context.Provider
            value={{
                isWeb3Ready: isReady,
                executeTransaction
            }}
        >
            {children}
        </Web3Context.Provider>
    );
}