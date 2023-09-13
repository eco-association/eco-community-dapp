import { pxToRem, styled, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { breakpoints, mq } from "../../../utilities";

const BlockBase = styled.div({
  padding: "12px 8px",
  width: 116,
  borderRadius: 8,
  backgroundColor: "#FFFFFF19",

  [mq(breakpoints.sm)]: {
    padding: 16,
    minWidth: 126,
    width: "fit-content",
  },
});

const BodyText = styled(Typography)({
  fontSize: pxToRem(10),
  [mq(breakpoints.md)]: {
    fontSize: pxToRem(11),
  },
});

interface BlockProps {
  content: React.ReactNode;
  title: string;
}

export const Block: React.FC<BlockProps> = ({ content, title }) => {
  return (
    <BlockBase>
      {content}
      <BodyText variant="body3" color="success">
        {title}
      </BodyText>
    </BlockBase>
  );
};
