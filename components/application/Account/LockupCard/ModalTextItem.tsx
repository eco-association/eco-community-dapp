import { Column, Row, Typography } from "@ecoinc/ecomponents";
import React from "react";

interface ModalTextItemProps {
  title: React.ReactNode;
  text: React.ReactNode;
  subtitle?: React.ReactNode;
}

export const ModalTextItem: React.FC<ModalTextItemProps> = ({
  text,
  subtitle,
  title,
}) => {
  return (
    <Column>
      <Typography variant="subtitle1" color="secondary">
        {title}
      </Typography>
      <Row gap="sm">
        <Typography>{text}</Typography>
        <Typography color="secondary">{subtitle}</Typography>
      </Row>
    </Column>
  );
};
