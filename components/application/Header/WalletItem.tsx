import React, { useState } from "react";
import { HeaderItem } from "./HeaderItem";
import { useAccount, useDisconnect } from "wagmi";
import { displayAddress } from "../../../utilities";
import { Button, Dropdown, DropdownItem, Row } from "@ecoinc/ecomponents";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";

const buttonVariant = css({
  height: "24px",
  width: "76px",
  color: "#ffffff",
  opacity: "0.6",
  padding: 0,
  fontSize: "13px",
});

export const WalletItem = () => {
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  const [disconnectOpen, setDisconnectOpen] = useState(false);

  if (isConnected) {
    return (
      <Row items="center" gap="sm">
        <HeaderItem onClick={() => setDisconnectOpen(!disconnectOpen)}>
          {displayAddress(address)}
        </HeaderItem>
        <Dropdown open={disconnectOpen} setOpen={setDisconnectOpen}>
          <DropdownItem
            onClick={() => {
              disconnect();
              localStorage.clear();
              setDisconnectOpen(false);
            }}
          >
            Disconnect Wallet
          </DropdownItem>
        </Dropdown>
      </Row>
    );
  }

  return (
    <React.Fragment>
      <ConnectButton.Custom>
        {({ openConnectModal }) => (
          <Button
            css={buttonVariant}
            variant="outline"
            color="secondary"
            onClick={openConnectModal}
          >
            Connect
          </Button>
        )}
      </ConnectButton.Custom>
    </React.Fragment>
  );
};
