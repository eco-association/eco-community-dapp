import React from "react";
import { Color, Grid, Row, styled, Typography } from "@ecoinc/ecomponents";
import { XIcon } from "./XIcon";

interface TopBarProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as" | "rows"> {
  color?: Color;

  onRequestClose?(event: React.MouseEvent | React.KeyboardEvent): void;
}

const Bar = styled(Grid)<TopBarProps>(({ theme, color, onRequestClose }) => ({
  width: "100%",
  background: theme.palette[color].main,
  ...(onRequestClose ? { gridTemplateColumns: "1fr auto", gap: "8px" } : {}),
}));

const Content = styled(Row)<TopBarProps>(({ onClick }) => ({
  padding: "12px 8px",
  ...(onClick ? { cursor: "pointer" } : {}),
}));

const Icon = styled.div({ cursor: "pointer", paddingRight: 8 });

export const TopBar: React.FC<React.PropsWithChildren<TopBarProps>> = ({
  children,
  color = "success",
  onClick,
  ...props
}) => {
  return (
    <Bar color={color} alignItems="center" {...props}>
      <Content justify="center" onClick={onClick}>
        <Typography variant="body2" style={{ fontSize: 12 }}>
          {children}
        </Typography>
      </Content>
      {props.onRequestClose && (
        <Icon onClick={props.onRequestClose}>
          <XIcon />
        </Icon>
      )}
    </Bar>
  );
};
