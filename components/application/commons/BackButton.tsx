import { Row, Typography } from "@ecoinc/ecomponents";
import { Arrow } from "./Arrow";
import { css } from "@emotion/react";
import React from "react";
import { useRouter } from "next/router";

const arrow = css({ transform: "rotate(180deg)", scale: 0.6 });

export const BackButton: React.FC = () => {
  const router = useRouter();

  return (
    <Row
      items="center"
      gap="md"
      onClick={() => router.replace("/proposals", undefined, { shallow: true })}
      style={{ cursor: "pointer" }}
    >
      <Arrow color="success" css={arrow} />
      <Typography inline color="success" variant="body3">
        BACK
      </Typography>
    </Row>
  );
};
