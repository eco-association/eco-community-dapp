import React, { useState } from "react";
import Image from "next/image";
import { HeaderItem } from "./HeaderItem";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { displayAddress } from "../../../utilities";
import {
  Button,
  Column,
  Dropdown,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";
import CopyIcon from "../../../public/images/copyIcon.svg";
import ExternalIcon from "../../../public/images/external-icon.svg";
import Link from "next/link";

const DropdownContainer = styled(Column)(({ theme }) => ({
  height: 300,
  width: 300,
  backgroundColor: theme.palette.background.paper,
  padding: 16,
  borderRadius: 8,
}));

const Section = styled(Column)(({ theme }) => ({
  padding: 16,
  width: "100%",
  borderTop: `2px solid `,
  borderBottom: `2px solid`,
}));

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
  const { chain } = useNetwork();

  const correctChain =
    chain?.network.toString() === process.env.NEXT_PUBLIC_CHAIN;

  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  if (isConnected) {
    return (
      <Row items="center" gap="sm">
        <HeaderItem onClick={() => setDisconnectOpen(!disconnectOpen)}>
          {displayAddress(address)}
        </HeaderItem>
        <Dropdown open={disconnectOpen} setOpen={setDisconnectOpen}>
          <DropdownContainer items="center">
            <Row>
              <Typography variant="h2" color="secondary">
                {displayAddress(address)}
              </Typography>
            </Row>
            <Row style={{ marginTop: 16, marginBottom: 16 }}>
              <Button
                css={{ height: 40, padding: 0, marginRight: 8 }}
                color="secondary"
              >
                Switch Wallet
              </Button>
              <Button color="secondary" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </Row>
            <Section items="left">
              <Typography variant="body1" color="secondary">
                Network
              </Typography>
              <Typography variant="h4">
                {" "}
                <Typography inline color={correctChain ? "success" : "error"}>
                  •
                </Typography>{" "}
                {chain.name}
              </Typography>
            </Section>
            <Column css={{ width: "100%", padding: 16 }}>
              <Row items="left" css={{ marginBottom: 16 }}>
                <Image src={CopyIcon} alt="" height={20} width={20} />
                <Typography variant="body1" onClick={copyAddress}>
                  Copy address
                </Typography>
              </Row>
              <Row>
                <Image src={ExternalIcon} alt="" height={20} width={20} />
                <Link href={`https://www.etherscan.io/address/${address}`}>
                  <Typography variant="body2">View on Explorer</Typography>
                </Link>
              </Row>
            </Column>
          </DropdownContainer>
          {/* <DropdownItem
            onClick={() => {
              disconnect();
              localStorage.clear();
              setDisconnectOpen(false);
            }}
          >
            Disconnect Wallet
          </DropdownItem> */}
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
