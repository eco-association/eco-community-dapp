import React, { createContext, useContext, useState } from "react";

export enum ProposalsTab {
  Active = "active",
  Past = "past",
  Create = "create",
}

export type ContextValues = {
  active: ProposalsTab;
  setActive: React.Dispatch<React.SetStateAction<ProposalsTab>>;
};

export const DefaultValues: ContextValues = {
  active: ProposalsTab.Active,
  setActive: () => null,
};

export const ProposalTabContext = createContext<ContextValues>(DefaultValues);

export const useProposalTabContext = () => useContext(ProposalTabContext);

export const ProposalTabProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [active, setActive] = useState<ProposalsTab>(ProposalsTab.Active);
  return (
    <ProposalTabContext.Provider value={{ active, setActive }}>
      {children}
    </ProposalTabContext.Provider>
  );
};
