import React from "react";
import Image from "next/image";
import { Row, RowProps, styled, Typography } from "@ecoinc/ecomponents";
import ExternalIcon from "../../../public/images/external-icon.svg";
import { breakpoints, mq } from "../../../utilities";

const MoreButton = styled(Row)(({ theme }) => ({
  display: "none",

  borderRadius: 21,
  padding: "8px 12px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
  [mq(breakpoints.md)]: {
    display: "flex",
  },
}));

export const ExternalButton: React.FC<React.PropsWithChildren<RowProps>> = ({
  children,
  ...props
}) => {
  return (
    <MoreButton gap="sm" items="center" {...props}>
      <Typography variant="body3" color="secondary">
        {children}
      </Typography>
      <Image
        src={ExternalIcon}
        alt="external"
        layout="fixed"
        width={16}
        height={16}
      />
    </MoreButton>
  );
};
