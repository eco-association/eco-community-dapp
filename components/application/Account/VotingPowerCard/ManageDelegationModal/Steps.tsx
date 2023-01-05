import React from "react";
import { Column, Typography } from "@ecoinc/ecomponents";

interface StepsProps {
  totalSteps: number;
  currentStep: number;
  status: string;
  center?: boolean;
}

export const Steps: React.FC<StepsProps> = ({
  totalSteps,
  currentStep,
  status,
  center,
}) => {
  return (
    <Column items={center ? "center" : ""}>
      <Typography
        variant="body3"
        color="secondary"
        style={center ? { textAlign: "center" } : undefined}
      >
        STEP {currentStep} OF {totalSteps}
      </Typography>
      <Typography
        variant="body2"
        color="active"
        style={center ? { textAlign: "center" } : undefined}
      >
        {status}
      </Typography>
    </Column>
  );
};
