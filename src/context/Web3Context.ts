import { createContext } from "react";

export default createContext({
    executeTransaction: (gesture: string) => {},
    isWeb3Ready: false
});