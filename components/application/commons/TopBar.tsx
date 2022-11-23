import { Color, Row, RowProps, styled } from "@ecoinc/ecomponents";
import React from "react";
import { XIcon } from "./XIcon";

interface TopBarProps extends RowProps {
  color?: Color;
  onRequestClose?(event: React.MouseEvent | React.KeyboardEvent): void;
}

const Content = styled(Row)<TopBarProps>(({ theme, color }) => ({
  ...theme.typography.body3,
  fontSize: 12,
  width: "100%",
  padding: "12px 8px",
  cursor: "pointer",
  background: theme.palette[color].main,
}));

const Icon = styled.div({
  top: 13,
  right: 24,
  position: "absolute",
  cursor: "pointer",
});

export const TopBar: React.FC<React.PropsWithChildren<TopBarProps>> = ({
  children,
  color = "success",
  onRequestClose,
  ...props
}) => {
  return (
    <Content color={color} items="center" justify="center" {...props}>
      {children}
      {onRequestClose && (
        <Icon onClick={onRequestClose}>
          <XIcon />
        </Icon>
      )}
    </Content>
  );
};
