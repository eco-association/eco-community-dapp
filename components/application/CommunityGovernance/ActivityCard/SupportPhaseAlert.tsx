import { Grid, styled, Typography, Alert, Column } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";

import Image from "next/image";
import { useRouter } from "next/router";
import ChevronRight from "../../../../public/images/chevron-right.svg";

const ArticleContainer = styled(Grid)(({ theme }) => ({
  padding: 8,
  margin: -8,
  borderRadius: 8,
  cursor: "pointer",
  "&:hover": {
    backgroundColor: theme.palette.background.paper,
    "& span": {
      opacity: 0.7,
    },
  },
}));

const fontWeight = css({ fontWeight: "bold" });

export const SupportPhaseAlert = () => {
  const router = useRouter();

  return (
    <Alert color="transparent">
      <ArticleContainer
        gap="24px"
        columns="1fr auto"
        alignItems="center"
        onClick={() => router.push("/proposals")}
      >
        <Column>
          <Typography variant="body1" css={fontWeight}>
            Proposal Support phase{" "}
            <Typography inline variant="h5" color="active">
              • Active{" "}
            </Typography>
          </Typography>
          <Typography variant="body2">
            Browse or submit proposals for this governance cycle.
          </Typography>
        </Column>
        <Image
          alt="go"
          src={ChevronRight}
          layout="fixed"
          width={9}
          height={18}
        />
      </ArticleContainer>
    </Alert>
  );
};
