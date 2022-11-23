import React from "react";
import { Color, Grid, styled } from "@ecoinc/ecomponents";
import { XIcon } from "./XIcon";

interface TopBarProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as" | "rows"> {
  color?: Color;

  onRequestClose?(event: React.MouseEvent | React.KeyboardEvent): void;
}

const Content = styled(Grid)<TopBarProps & { clickable?: boolean }>(
  ({ theme, color, clickable, onRequestClose }) => ({
    ...theme.typography.body3,
    fontSize: 12,
    width: "100%",
    padding: "12px 8px",
    background: theme.palette[color].main,
    ...(clickable ? { cursor: "pointer" } : {}),
    ...(onRequestClose ? { gridTemplateColumns: "1fr 24px", gap: "8px" } : {}),
  })
);

const Icon = styled.div({ cursor: "pointer" });

export const TopBar: React.FC<React.PropsWithChildren<TopBarProps>> = ({
  children,
  color = "success",
  onClick,
  ...props
}) => {
  return (
    <Content
      color={color}
      clickable={!!onClick}
      alignItems="center"
      justifyContent="center"
      {...props}
    >
      <div onClick={onClick} style={{ justifySelf: "center" }}>
        {children}
      </div>
      {props.onRequestClose && (
        <Icon onClick={props.onRequestClose}>
          <XIcon />
        </Icon>
      )}
    </Content>
  );
};
