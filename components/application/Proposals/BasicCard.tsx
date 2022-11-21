import { Card, Column, styled, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { css } from "@emotion/react";

const StyledCard = styled(Card)({
  width: "100%",
  maxWidth: 564,
  padding: "24px 72px",
  margin: "24px auto",
});

interface BasicInfoCardProps {
  title: string;
  subtitle?: string;
  body: React.ReactNode;
}

const Title = styled(Typography)({
  lineHeight: "24px",
  textAlign: "center",
  letterSpacing: "-0.015em",
});
const centerText = css({ textAlign: "center" });

export const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  title,
  subtitle,
  body,
}) => {
  return (
    <StyledCard>
      <Column gap="lg" items="center">
        <Column gap="md" items="center">
          {subtitle ? (
            <Typography variant="body3" color="secondary">
              {subtitle}
            </Typography>
          ) : null}
          <Title variant="h3">{title}</Title>
        </Column>
        <Typography variant="body1" color="secondary" css={centerText}>
          {body}
        </Typography>
      </Column>
    </StyledCard>
  );
};
