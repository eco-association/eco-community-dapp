import { Column, Grid, styled, Typography } from "@ecoinc/ecomponents";

import Image from "next/image";
import ChevronRight from "../../../../public/images/chevron-right.svg";
import React from "react";
import { useDiscourseTopics } from "../../../hooks/useDiscourseTopics";

interface ArticleProps {
  title: string;
  url: string;
  body?: string;
}

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

const Article: React.FC<ArticleProps> = ({ title, body, url }) => {
  const openArticle = () => window.open(url);
  return (
    <ArticleContainer
      columns="1fr auto"
      alignItems="center"
      gap="24px"
      onClick={openArticle}
    >
      <div>
        <Typography variant="h5">{title}</Typography>
        <Typography variant="body2">{body}</Typography>
      </div>
      <Image alt="go" src={ChevronRight} layout="fixed" width={9} height={18} />
    </ArticleContainer>
  );
};

const TRUSTEE_TOPICS_URL = process.env.NEXT_PUBLIC_TRUSTEE_TOPICS_URL;

export const TrusteesArticles = () => {
  const { data: topics } = useDiscourseTopics(TRUSTEE_TOPICS_URL);

  if (!topics.length) return null;

  return (
    <Column gap="md">
      <Typography variant="body3" color="secondary">
        FROM THE TRUSTEES
      </Typography>
      <Column gap="lg">
        {topics.slice(0, 3).map((topic) => (
          <Article
            key={topic.id}
            title={topic.title}
            body={topic.excerpt}
            url={topic.url}
          />
        ))}
      </Column>
    </Column>
  );
};
