import React, { useState } from "react";
import Image from "next/image";
import { HeaderItem } from "./HeaderItem";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import { displayAddress, etherscanURL } from "../../../utilities";
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
import Copy from "../../../public/images/Copy.svg";
import Share from "../../../public/images/Share.svg";
import Link from "next/link";

const DropdownContainer = styled(Column)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  paddingTop: 16,
  paddingLeft: 16,
  paddingRight: 16,
}));

const Section = styled(Column)(() => ({
  paddingBottom: 16,
  width: "100%",
}));

const buttonVariant = css({
  height: "24px",
  width: "76px",
  color: "#ffffff",
  opacity: "0.6",
  padding: "0 !important",
  fontSize: "13px",
});

const disconnectButton = css({
  height: "36px",
  width: "100%",
  color: "#22313A",
  opacity: "0.6",
  padding: "0 !important",
  fontSize: "13px",
  marginTop: 12,
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
          <DropdownContainer items="left">
            <Column gap="md">
              <Row>
                <Typography variant="body1" color="secondary">
                  {displayAddress(address, 8).toLowerCase()}{" "}
                  <Image
                    src={Copy}
                    alt=""
                    height={15}
                    width={13.1}
                    onClick={copyAddress}
                  />
                </Typography>
              </Row>
              <Row items="center" gap="lg">
                <Image src={Share} alt="" height={20} width={20} />
                <Link href={etherscanURL(address, "address")}>
                  <Typography variant="body2">View on Explorer</Typography>
                </Link>
              </Row>
              <Section items="left">
                <Typography variant="body2">
                  {" "}
                  <Typography inline color={correctChain ? "success" : "error"}>
                    •
                  </Typography>{" "}
                  {chain.id === 1 ? "ETH" : chain.name}{" "}
                  <Typography variant="body2" color="secondary" inline>
                    Network
                  </Typography>
                </Typography>
                <Button
                  variant="fill"
                  color="disabled"
                  css={disconnectButton}
                  onClick={() => disconnect()}
                >
                  Disconnect
                </Button>
              </Section>
            </Column>
          </DropdownContainer>
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
