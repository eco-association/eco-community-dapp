import React from "react";
import { Button, Column, Row, Typography } from "@ecoinc/ecomponents";
import { displayAddress } from "../../../../../utilities";

type ConfirmDialogueProps =
  | {
      enable: true;
      delegate: string;
      handleConfirm: (boolean) => void;
    }
  | {
      enable?: false;
      delegate?: undefined;
      handleConfirm?: undefined;
    };

const ConfirmDialogue: React.FC<ConfirmDialogueProps> = ({
  enable,
  delegate,
  handleConfirm,
}) => {
  return (
    <Row
      items="center"
      style={{
        borderRadius: 6,
        padding: 16,
        border: "1px solid #DA1E28",
        backgroundColor: "#FDF4F4",
      }}
    >
      <Column gap="md">
        <Typography variant="h5" color="error" style={{ lineHeight: 1 }}>
          {enable
            ? `Are you sure you want to enable?`
            : "Cannot disable receiving delegation... yet"}
        </Typography>
        <Typography variant="body2">
          {enable
            ? `To do so, you will first need to stop delegating your votes to ${displayAddress(
                delegate || ""
              )}. Proceed?`
            : "You must first wait for others to stop delegating their votes you you."}
        </Typography>
      </Column>
      {enable && (
        <Button
          variant="fill"
          color="error"
          onClick={() => handleConfirm(enable)}
          css={{
            backgroundColor: "#ED575F",
            color: "#510408",
            marginLeft: "38px",
          }}
        >
          Enable
        </Button>
      )}
    </Row>
  );
};

export default ConfirmDialogue;
