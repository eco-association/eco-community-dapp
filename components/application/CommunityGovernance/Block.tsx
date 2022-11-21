import { styled, Typography } from "@ecoinc/ecomponents";
import React from "react";

const BlockBase = styled.div({
  padding: 16,
  minWidth: 126,
  borderRadius: 8,
  backgroundColor: "#FFFFFF19",
});

interface BlockProps {
  content: React.ReactNode;
  title: string;
}

export const Block: React.FC<BlockProps> = ({ content, title }) => {
  return (
    <BlockBase>
      {content}
      <Typography variant="body3" color="success">
        {title}
      </Typography>
    </BlockBase>
  );
};
