import React from "react";
import { css } from "@emotion/react";
import {
  Color,
  Column,
  styled,
  Typography,
  TypographyProps,
  useTheme,
} from "@ecoinc/ecomponents";

interface ProgressCircleProps {
  radius: number;
  stroke?: number;
  progress: number;
  textColor: Color;
  strokeColor: Color;
  textVariant?: TypographyProps["variant"];
  subtitle?: {
    text: string;
    options?: TypographyProps;
  };
}

const Container = styled.div({ position: "relative" });

const FloatingText = styled.div({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  "& span": { lineHeight: 1 },
});

const smallFont = css({ fontSize: 7 });

export const ProgressCircle: React.FC<ProgressCircleProps> = ({
  radius,
  progress: rawProgress,
  strokeColor: rawStokeColor,
  textColor,
  textVariant = "h5",
  subtitle,
  stroke = 4,
}) => {
  const theme = useTheme();

  const length = radius * 2;
  const normalizedRadius = radius - stroke;
  const progress = Math.min(1, rawProgress);
  const percentage = Math.floor(progress * 100);
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - progress * circumference;

  const strokeColor = theme.palette[rawStokeColor].main;
  const baseStrokeColor = theme.palette.disabled.bg;

  return (
    <Container style={{ height: length, width: length }}>
      <FloatingText>
        <Column items="center" gap="xs">
          <Typography variant={textVariant} color={textColor}>
            {percentage}%
          </Typography>
          {subtitle ? (
            <Typography variant="body3" css={smallFont} {...subtitle.options}>
              {subtitle.text}
            </Typography>
          ) : null}
        </Column>
      </FloatingText>
      <svg
        height={length}
        width={length}
        style={{ transform: "rotate(-90deg)" }}
      >
        <circle
          fill="transparent"
          stroke={baseStrokeColor}
          strokeDasharray={circumference + " " + circumference}
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
        <circle
          fill="transparent"
          stroke={strokeColor}
          strokeDasharray={circumference + " " + circumference}
          style={{ strokeDashoffset }}
          strokeWidth={stroke}
          r={normalizedRadius}
          cx={radius}
          cy={radius}
        />
      </svg>
    </Container>
  );
};
