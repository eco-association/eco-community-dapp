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
  const titleStyle = function () {
    if (window.innerWidth < 500) {
      return {
        fontSize: "10px",
      };
    } else {
      return;
    }
  };
  const blockBaseStyle = function () {
    if (window.innerWidth < 500) {
      return {
        padding: "12px 8px",
      };
    } else {
      return;
    }
  };
  return (
    <BlockBase style={blockBaseStyle()}>
      {content}
      <Typography variant="body3" color="success" style={titleStyle()}>
        {title}
      </Typography>
    </BlockBase>
  );
};
