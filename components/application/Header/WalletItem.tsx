import React, { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { HeaderItem } from "./HeaderItem";
import { useAccount, useDisconnect, useNetwork } from "wagmi";
import {
  breakpoints,
  displayAddress,
  etherscanURL,
  mq,
  mqMax,
  useMediaQuery,
} from "../../../utilities";
import {
  Button,
  Column,
  Dropdown,
  Row,
  styled,
  Typography,
  Variant,
  Color,
} from "@ecoinc/ecomponents";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { css } from "@emotion/react";
import Copy from "../../../public/images/Copy.svg";
import ShareIcon from "../../../public/images/Share-colored.svg";

import Share from "../../../public/images/Share.svg";
import Link from "next/link";

const DropdownMenuStyled = styled(Dropdown)({
  width: "100%",
});

const DropdownContainer = styled(Column)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: 8,
  paddingTop: 16,
  paddingLeft: 16,
  paddingRight: 16,

  [mqMax(breakpoints.lg - 1)]: {
    background: "transparent",
  },
}));

const headerItemStyle = css({
  display: "none",
  [mq(breakpoints.lg)]: {
    display: "block",
  },
});

const menuStyle = css({
  [mqMax(breakpoints.lg - 1)]: {
    position: "relative",
    top: "unset",
    left: "unset",
    right: "unset",

    ">div": {
      padding: 0,
      borderRadius: 0,
    },
  },
});

const buttonVariant = css({
  height: "36px",
  color: "#ffffff",
  opacity: "0.6",
  padding: "0 !important",
  fontSize: "13px",
  width: "100%",

  [mq(breakpoints.lg)]: {
    height: "24px",
    width: "76px",
  },
});

const disconnectButton = css({
  height: "36px",
  width: "100%",
  padding: "0 !important",
  fontSize: "13px",
  marginTop: 12,
  backgroundColor: "#DEE6EB",
  color: "#22313A",

  [mq(breakpoints.lg)]: {
    color: "#22313A",
    opacity: "0.6",
    marginBottom: "16px",
  },
});

const TextContainer = styled.div({
  display: "flex",
  alignItems: "center",
});

const Dot = styled.span(({ color }) => ({
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  background: color,
  display: "inline-block",
  marginRight: "4px",
}));

const styles = {
  colorMed: { color: "#5F869F !important" },
  outerPadding: { padding: "32px 44px" },
  spaceRight: { marginRight: "10px" },
  alignCenter: { display: "flex", placeItems: "center" },
  innerPadding: {
    padding: "32px 44px",
    background: "rgba(255, 255, 255, 0.05)",
  },
};

export const WalletItem = () => {
  const ref = useRef<HTMLDivElement>(null);

  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();
  const { chain } = useNetwork();

  const isDesktop = useMediaQuery("(min-width: 992px)");

  const correctChain =
    chain?.network.toString() === process.env.NEXT_PUBLIC_CHAIN;

  const [disconnectOpen, setDisconnectOpen] = useState(false);

  const copyAddress = () => {
    navigator.clipboard.writeText(address);
  };

  const responsiveStyle = useMemo(() => {
    if (isDesktop) {
      return {
        address: {
          color: "secondary" as Color,
          variant: "body1" as Variant,
          css: {},
        },
        view: {
          color: "textPrimary" as Color,
          variant: "body2" as Variant,
          gap: "lg",
          css: {},
        },
        chain: {
          color: "textPrimary" as Color,
          variant: "body2" as Variant,
          css: { ...styles.alignCenter, marginRight: "5px" },
        },
        network: {
          color: "secondary" as Color,
          variant: "body2" as Variant,
          css: {},
        },
        colGap: "md",
        shareIcon: Share,
        shareIconOrder: 0,
      };
    }

    return {
      address: {
        color: "white" as Color,
        variant: "body2" as Variant,
        css: styles.spaceRight,
      },
      view: {
        color: "white" as Color,
        variant: "body2" as Variant,
        gap: "sm",
        css: styles.spaceRight,
      },
      chain: {
        color: "white" as Color,
        variant: "body2" as Variant,
        css: { ...styles.spaceRight, ...styles.alignCenter },
      },
      network: {
        color: "secondary" as Color,
        variant: "body2" as Variant,
        css: styles.colorMed,
      },
      colGap: "xxl",
      shareIcon: ShareIcon,
      shareIconOrder: 1,
    };
  }, [isDesktop]);

  useEffect(() => {
    if (isDesktop) {
      setDisconnectOpen(false);
    } else {
      setDisconnectOpen(true);
    }
  }, [isDesktop]);

  if (isConnected) {
    return (
      <Row items="center" gap="sm">
        <HeaderItem
          css={headerItemStyle}
          onClick={() => setDisconnectOpen(!disconnectOpen)}
        >
          {displayAddress(address)}
        </HeaderItem>

        <DropdownMenuStyled
          ref={ref}
          showCaret={isDesktop}
          open={disconnectOpen}
          setOpen={setDisconnectOpen}
          menuStyle={menuStyle}
        >
          <DropdownContainer items="left">
            <Column gap={responsiveStyle.colGap}>
              <Row css={{ gap: 3 }}>
                <Typography
                  variant={responsiveStyle.address.variant}
                  color={responsiveStyle.address.color}
                  css={responsiveStyle.address.css}
                >
                  {displayAddress(address, 8).toLowerCase()}{" "}
                </Typography>

                <Image
                  src={Copy}
                  alt=""
                  height={15}
                  width={13.1}
                  onClick={copyAddress}
                />
              </Row>

              <Row items="center" gap={responsiveStyle.view.gap}>
                <span
                  style={{
                    order: responsiveStyle.shareIconOrder,
                    lineHeight: 0,
                  }}
                >
                  <Image
                    src={responsiveStyle.shareIcon}
                    alt=""
                    height={20}
                    width={20}
                  />
                </span>

                <Link href={etherscanURL(address, "address")}>
                  <Typography
                    variant={responsiveStyle.view.variant as Variant}
                    color={responsiveStyle.view.color}
                    css={responsiveStyle.view.css}
                  >
                    View on Explorer
                  </Typography>
                </Link>
              </Row>

              <TextContainer>
                <Typography
                  color={responsiveStyle.chain.color}
                  variant={responsiveStyle.chain.variant}
                  css={responsiveStyle.chain.css}
                >
                  <Dot color={correctChain ? "#56D9B6" : "#DA1E28"} />{" "}
                  {chain.id === 1 ? "ETH" : chain.name}
                </Typography>{" "}
                <Typography
                  color={responsiveStyle.network.color}
                  variant={responsiveStyle.network.variant}
                  css={responsiveStyle.network.css}
                >
                  Network
                </Typography>
              </TextContainer>

              <Button
                variant="fill"
                color="disabled"
                css={disconnectButton}
                onClick={() => disconnect()}
              >
                Disconnect
              </Button>
            </Column>
          </DropdownContainer>
        </DropdownMenuStyled>
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
