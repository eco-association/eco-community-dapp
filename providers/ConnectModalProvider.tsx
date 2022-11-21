import { createContext, useContext, useEffect, useState } from "react";
import { useAccount } from "wagmi";
import { ConnectDialog } from "../components/application/ConnectDialog";

export type ContextValues = {
  display: boolean;
  setDisplay: React.Dispatch<React.SetStateAction<boolean>>;
  preventUnauthenticatedActions: () => boolean;
};

export const DefaultValues: ContextValues = {
  display: false,
  setDisplay: () => null,
  preventUnauthenticatedActions: () => null,
};

interface Props {
  children: React.ReactNode;
}

export const ConnectContext = createContext<ContextValues>(DefaultValues);

export const useConnectContext = () => useContext(ConnectContext);

export const ConnectModalProvider = ({ children }: Props) => {
  const { isConnected } = useAccount();
  const [display, setDisplay] = useState(false);

  useEffect(() => {
    if (isConnected) setDisplay(false);
  }, [isConnected]);

  const preventUnauthenticatedActions = (): boolean => {
    if (!isConnected) {
      setDisplay(true);
    }
    return isConnected;
  };

  return (
    <ConnectContext.Provider
      value={{ display, setDisplay, preventUnauthenticatedActions }}
    >
      <ConnectDialog
        isOpen={display}
        onRequestClose={() => setDisplay(false)}
      />
      {children}
    </ConnectContext.Provider>
  );
};
