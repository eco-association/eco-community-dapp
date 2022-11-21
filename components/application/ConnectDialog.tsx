import React from "react";
import {
  Button,
  Column,
  Dialog,
  DialogProps,
  Typography,
} from "@ecoinc/ecomponents";
import { css } from "@emotion/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const text = css({ width: 400, textAlign: "center" });

export const ConnectDialog: React.FC<DialogProps> = (props) => {
  return (
    <Dialog
      {...props}
      style={{
        ...props.style,
        overlay: { ...props.style?.overlay, zIndex: 10000 },
      }}
    >
      <Column gap="xxl" items="center">
        <Column gap="lg" items="center">
          <Typography variant="h3" css={text}>
            To participate in governance, connect your wallet
          </Typography>
          <Typography variant="body1" css={text}>
            We’re on a mission to reinvent money. The Eco community is open to
            everyone.
          </Typography>
        </Column>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <Button color="success" onClick={openConnectModal}>
              Connect
            </Button>
          )}
        </ConnectButton.Custom>
      </Column>
    </Dialog>
  );
};
