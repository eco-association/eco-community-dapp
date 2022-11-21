import React, { useRef, useState } from "react";
import { Column, Row, Typography } from "@ecoinc/ecomponents";
import { css } from "@emotion/react";

type TextLoaderProps = {
  phrases?: string[];
};

const defaultPhrases = [
  "Hang tight, this can take a minute or two.",
  "Constructing additional pylons...",
  "Still loading...",
  "Watering Merkle trees...",
  "Reticulating splines...",
  "Mining more vespene gas...",
  "Building a block...",
  "Coordinating consensus...",
  "Consulting the chain...",
  "Reading a few whitepapers...",
];

const textWrap = css({
  height: 30,
  display: "flex",
  alignItems: "center",
});
const phrasesStyle = css({
  position: "absolute",
  transition: ".1s transform linear",
});
const textStyles = css({
  height: 30,
});
const wrapper = css({
  position: "relative",
  overflow: "hidden",
});

const TextLoader = ({ phrases = defaultPhrases }: TextLoaderProps) => {
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(0);

  React.useEffect(() => {
    setHeight(measureRef.current.getBoundingClientRect().height);

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev === phrases.length - 1 ? 0 : prev + 1));
    }, 2500);
    return () => {
      window.clearInterval(timer);
    };
  }, [phrases.length]);

  const measureRef = useRef<HTMLDivElement>(null);

  return (
    <Column css={wrapper}>
      <Column style={{ opacity: 0 }}>
        <Column css={textStyles} ref={measureRef}>
          {phrases[0]}
        </Column>
      </Column>
      <Column
        css={phrasesStyle}
        style={{
          transform: `translateY(${index * -height}px)`,
        }}
      >
        {phrases.map((phrase) => (
          <Column css={{ whiteSpace: "nowrap" }} key={phrase}>
            <Row items="center" css={textWrap}>
              <Typography variant="body2" color="secondary">
                {phrase}
              </Typography>
            </Row>
          </Column>
        ))}
      </Column>
    </Column>
  );
};

export default TextLoader;
