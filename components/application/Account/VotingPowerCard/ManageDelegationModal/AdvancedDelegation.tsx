import { Column, Row, Typography } from "@ecoinc/ecomponents";
import React from "react";
import { useDelegationState } from "./provider/ManageDelegationProvider";
import { ManageToken } from "./ManageToken";

interface AdvancedDelegationProps {
  onClose(): void;
}

const AdvancedDelegation: React.FC<AdvancedDelegationProps> = ({ onClose }) => {
  const { state } = useDelegationState();
  const loading = state.eco.loading || state.secox.loading;

  return (
    <Column gap="xl">
      <Row justify="space-between" gap="md">
        <Column gap="sm">
          <Typography variant="h5">Advanced Delegation Settings</Typography>
          <Typography variant="body2" color="secondary">
            Independently control your delegation settings by currency type.
          </Typography>
        </Column>

        {state.eco.enabled === state.secox.enabled && !loading ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={onClose}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M13 1L7 7L13 13"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 1L7 7L1 13"
              stroke="black"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : null}
      </Row>
      <ManageToken token="eco" />
      <ManageToken token="secox" />
    </Column>
  );
};

export default AdvancedDelegation;
