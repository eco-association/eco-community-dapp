import React from "react";
import Image from "next/image";
import { Row, RowProps, styled, Typography } from "@ecoinc/ecomponents";
import ExternalIcon from "../../../public/images/external-icon.svg";

const MoreButton = styled(Row)(({ theme }) => ({
  borderRadius: 21,
  padding: "8px 12px",
  cursor: "pointer",
  backgroundColor: theme.palette.background.paper,
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
