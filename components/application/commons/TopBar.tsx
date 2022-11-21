import { Color, Row, RowProps, styled } from "@ecoinc/ecomponents";
import React from "react";

interface TopBarProps extends RowProps {
  color?: Color;
}

const Content = styled(Row)<TopBarProps>(({ theme, color }) => ({
  ...theme.typography.body3,
  fontSize: 12,
  width: "100%",
  padding: "12px 8px",
  cursor: "pointer",
  background: theme.palette[color].main,
}));

export const TopBar: React.FC<React.PropsWithChildren<TopBarProps>> = ({
  children,
  color = "success",
  ...props
}) => {
  return (
    <Content color={color} items="center" justify="center" {...props}>
      {children}
    </Content>
  );
};
