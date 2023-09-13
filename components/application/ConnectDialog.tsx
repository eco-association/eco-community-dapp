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
import useResponsiveDialog from "../hooks/useResponsiveDialog";
import { breakpoints, mq } from "../../utilities";

const text = css({
  textAlign: "center",
  [mq(breakpoints.sm)]: {
    width: 400,
  },
});

export const ConnectDialog: React.FC<DialogProps> = (props) => {
  const dialogStyles = useResponsiveDialog(524);

  return (
    <Dialog
      {...props}
      style={{
        ...props.style,
        ...dialogStyles,
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
