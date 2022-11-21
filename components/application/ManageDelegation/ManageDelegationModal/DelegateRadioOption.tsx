import { Row, styled, Typography } from "@ecoinc/ecomponents";
import React from "react";
import Loader from "../../Loader";

export enum DelegateOption {
  Receive,
  Delegate,
}

interface RadioProps {
  checked?: boolean;

  onChange?(checked: boolean): void;
}

const Radio: React.FC<RadioProps> = ({ checked, onChange }) => {
  if (checked) {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ cursor: "pointer" }}
        onClick={() => onChange && onChange(false)}
      >
        <g clipPath="url(#clip0_1869_88999)">
          <circle cx="12" cy="12" r="11" stroke="#128264" strokeWidth="2" />
          <circle cx="12" cy="12" r="4" fill="#128264" />
        </g>
        <defs>
          <clipPath id="clip0_1869_88999">
            <rect width="24" height="24" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ cursor: "pointer" }}
      onClick={() => onChange && onChange(true)}
    >
      <circle cx="12" cy="12" r="11" stroke="#DEE6EB" strokeWidth="2" />
    </svg>
  );
};

const LoadingContainer = styled(Row)({
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgb(255,255,255,0.9)",
});

export interface DelegateRadioOptionProps {
  loading?: boolean;
  disable?: boolean;
  value: DelegateOption;

  onChange(value: DelegateOption): void;
}

export const DelegateRadioOption: React.FC<DelegateRadioOptionProps> = ({
  value,
  loading,
  disable,
  onChange,
}) => {
  return (
    <div style={{ position: "relative" }}>
      {loading ? (
        <LoadingContainer gap="md" items="center" justify="center">
          <Typography variant="body1" color="secondary">
            modifying...
          </Typography>
          <Loader />
        </LoadingContainer>
      ) : null}
      <Row gap="xl" style={!loading && disable ? { opacity: 0.3 } : undefined}>
        <Row gap="md">
          <Radio
            checked={value === DelegateOption.Receive}
            onChange={() =>
              !disable &&
              !loading &&
              value !== DelegateOption.Receive &&
              onChange(DelegateOption.Receive)
            }
          />
          <Typography variant="h5">Receive</Typography>
        </Row>
        <Row gap="md">
          <Radio
            checked={value === DelegateOption.Delegate}
            onChange={() =>
              !disable &&
              !loading &&
              value !== DelegateOption.Delegate &&
              onChange(DelegateOption.Delegate)
            }
          />
          <Typography variant="h5">Delegate</Typography>
        </Row>
      </Row>
    </div>
  );
};
