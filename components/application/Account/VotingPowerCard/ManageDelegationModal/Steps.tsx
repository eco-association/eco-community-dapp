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
      <Typography variant="body3" color="secondary">
        STEP {currentStep} OF {totalSteps}
      </Typography>
      <Typography variant="body2" color="active">
        {status}
      </Typography>
    </Column>
  );
};
