import React from "react";
import { Column, Row, Typography, pxToRem, styled } from "@ecoinc/ecomponents";

import { HeaderInfo } from "./HeaderInfo";
import { InfoBlocks } from "../CommunityGovernance/InfoBlocks";
import { breakpoints, mq } from "../../../utilities";

const Container = styled(Row)({
  padding: "24px",

  [mq(breakpoints.sm)]: {
    alignItems: "center",
    flexDirection: "column",
  },
});

const TextContainer = styled(Column)({
  marginTop: "16px",
  gap: "24px",
  justifyContent: "center",

  [mq(breakpoints.sm)]: {
    gap: "8px",
    alignItems: "center",
  },
});

const Title = styled(Typography)({
  fontSize: pxToRem(24),

  [mq(breakpoints.md)]: {
    fontSize: pxToRem(32),
  },
});

const HeaderContent = () => {
  return (
    <Container gap="xl">
      <TextContainer>
        <Title variant="h1" color="white">
          Eco Community Governance
        </Title>

        <HeaderInfo home />
      </TextContainer>

      <InfoBlocks />
    </Container>
  );
};

export default HeaderContent;
