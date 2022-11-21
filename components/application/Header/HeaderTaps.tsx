import { Row, RowProps, styled, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { useCommunity } from "../../../providers";
import { ProposalsTab } from "../../../providers/ProposalTabProvider";
import { GenerationStage } from "../../../types";

interface HeaderTapProps {
  active?: ProposalsTab;
  count?: number;
  name: string;
  label: string;

  onClick?(): void;
}

interface TapsProps extends Omit<RowProps, "onSelect"> {
  active: ProposalsTab;
  onSelect(active: ProposalsTab): void;
}

export const HeaderTaps: React.FC<React.PropsWithChildren<TapsProps>> = ({
  children,
  active,
  onSelect,
  ...props
}) => {
  return (
    <Row css={{ gap: 64 }} {...props}>
      {React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return null;
        return React.cloneElement(child, {
          active: active === child.props.name,
          onClick: () => onSelect(child.props.name),
        });
      })}
    </Row>
  );
};

const HeaderTapContainer = styled(Row)<Pick<HeaderTapProps, "active">>(
  ({ theme, active }) => ({
    padding: "8px 12px",
    position: "relative",
    color: "#FFFFFF99",
    ...(active
      ? {
          fontWeight: 700,
          color: theme.palette.success.main,
          "&::after": {
            content: "''",
            left: 0,
            bottom: 0,
            height: 3,
            width: "100%",
            position: "absolute",
            backgroundColor: theme.palette.success.main,
          },
        }
      : {
          cursor: "pointer",
        }),
  })
);

const Counter = styled.div<Pick<HeaderTapProps, "active">>(
  ({ theme, active }) => ({
    display: "inline-block",
    padding: "4px 6px",
    lineHeight: 0,
    borderRadius: 50,
    ...(active
      ? { backgroundColor: theme.palette.success.main }
      : { backgroundColor: "#FFFFFF", opacity: 0.6 }),
  })
);

export const HeaderTap: React.FC<HeaderTapProps> = ({
  label,
  count,
  active,
  onClick,
  name,
}) => {
  const { stage } = useCommunity();
  return (
    <HeaderTapContainer
      gap="sm"
      items="center"
      active={active}
      onClick={onClick}
    >
      {label}
      {stage.name === GenerationStage.Submit && name === ProposalsTab.Active ? (
        <Counter active={active}>
          <Typography
            inline
            variant="h6"
            color="primary"
            style={{ lineHeight: 1 }}
          >
            {count}
          </Typography>
        </Counter>
      ) : null}
    </HeaderTapContainer>
  );
};
