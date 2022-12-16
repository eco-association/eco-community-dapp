import React, { useEffect, useState } from "react";
import { BigNumber } from "ethers";
import {
  Column,
  Dialog,
  formatNumber,
  Grid,
  Row,
  styled,
  Typography,
} from "@ecoinc/ecomponents";
import moment from "moment";
import Image from "next/image";
import { css } from "@emotion/react";

import DelegateCard from "./DelegateCard";
import EnableDelegationBox from "./EnableDelegationScreen";
import { displayAddress, tokensToNumber } from "../../../../utilities";
import { useWallet } from "../../../../providers";
import { useVotingPowerSources } from "../../../hooks/useVotingPowerSources";
import {
  DelegateValidation,
  useDelegationState,
} from "./provider/ManageDelegationProvider";

import chevronDown from "../../../../public/images/chevron-down.svg";
import chevronUp from "../../../../public/images/chevron-up.svg";
import AdvancedDelegation from "./AdvancedDelegation";
import Link from "next/link";
import EnableDelegationScreen from "./EnableDelegationScreen";
import DisableDelegationCard from "./DisableDelegationCard";

export enum Option {
  None,
  EcoMyWallet,
  SEcoXMyWallet,
  Lockup,
}

interface ManageDelegationModal {
  open: boolean;
  votingPower: BigNumber;
  currentGenVotingPower: BigNumber;
  onRequestClose: () => void;
}

interface DropdownBoxProps {
  open: boolean;
  amount: BigNumber;
  title: string;
  delegate?: string;
  red?: boolean;

  onToggle(): void;
}

const DropdownBoxStyle = styled(Column)<Pick<DropdownBoxProps, "red">>(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    padding: "12px 16px",
    borderRadius: "4px",
  })
);

const DelegateInputArea: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <DropdownBoxStyle gap="lg">
      <Grid columns="1fr 16px" gap="8px" style={{ alignItems: "center" }}>
        <Row items="center" gap="sm" style={{ flexWrap: "wrap" }}>
          <Typography variant="body1" color="primary" style={{ lineHeight: 1 }}>
            Delegate your voting power to someone?{" "}
            <Typography inline color="secondary">
              (optional)
            </Typography>
          </Typography>
        </Row>
      </Grid>
      {children}
    </DropdownBoxStyle>
  );
};

// const DropdownBox: React.FC<React.PropsWithChildren<DropdownBoxProps>> = ({
//   open,
//   red,
//   title,
//   amount,
//   delegate,
//   onToggle,
//   children,
// }) => {
//   return (
//     <DropdownBoxStyle red={red} gap="lg">
//       <Grid columns="1fr 16px" gap="8px" style={{ alignItems: "center" }}>
//         <Row items="center" gap="sm" style={{ flexWrap: "wrap" }}>
//           <Typography
//             variant="h5"
//             color={red ? "error" : "primary"}
//             style={{ lineHeight: 1 }}
//           >
//             {formatNumber(tokensToNumber(amount), false)}
//           </Typography>
//           <Typography
//             variant="h5"
//             color={red ? "error" : "active"}
//             style={{ lineHeight: 1 }}
//           >
//             &#x2022; {title}
//           </Typography>
//           {delegate ? (
//             <Typography
//               variant="h5"
//               color={red ? "error" : "secondary"}
//               style={{ lineHeight: 1 }}
//             >
//               &#x2022; delegated to {displayAddress(delegate)}
//             </Typography>
//           ) : null}
//         </Row>
//         {children && (
//           <Image
//             alt=""
//             onClick={onToggle}
//             css={{ cursor: "pointer" }}
//             src={open ? chevronUp : chevronDown}
//           />
//         )}
//       </Grid>
//       {open && children}
//     </DropdownBoxStyle>
//   );
// };

const ManageDelegationModal: React.FC<ManageDelegationModal> = ({
  open,
  votingPower,
  currentGenVotingPower,
  onRequestClose,
}) => {
  const sources = useVotingPowerSources();
  const { state } = useDelegationState();
  const { ecoBalance, sEcoXBalance } = useWallet();
  const [option, setOption] = useState(Option.None);
  const [advanced, setAdvanced] = useState(
    state.eco.enabled !== state.secox.enabled
  );
  console.log(state);
  const [selectedLockup, setSelectedLockup] = useState<string>(null);
  const [openDelegation, setOpenDelegation] = useState(false);

  const handleDropdownClick = (option: Option) => setOption(option);

  const loading = state.eco.loading || state.secox.loading;
  const delegationEnabled = state.eco.enabled || state.secox.enabled;

  useEffect(() => {
    if (state.eco.enabled !== state.secox.enabled) {
      setAdvanced(true);
    }
  }, [advanced, state.eco.enabled, state.secox.enabled]);

  return (
    <Dialog
      isOpen={open}
      onRequestClose={onRequestClose}
      shouldCloseOnEsc={!loading}
      shouldShowCloseButton={!loading}
      shouldCloseOnOverlayClick={!loading}
      style={{ card: { width: 540, padding: "40px 24px" } }}
    >
      {openDelegation ? (
        <EnableDelegationScreen back={() => setOpenDelegation(false)} />
      ) : (
        <Column gap="xl">
          <Column gap="xl" style={{ padding: "0 16px" }}>
            <Column gap="lg">
              <Typography variant="h2">Manage Voting Delegation</Typography>

              <Typography variant="body1" color="primary">
                All changes take effect at the start of the next generation.
              </Typography>
              {delegationEnabled && <DisableDelegationCard state={state} />}
              {!delegationEnabled && (
                <Typography variant="body1" color="secondary">
                  Or you can choose to become a delegate and receive voting
                  power from others. (Note that you cannot choose to both
                  delegate your voting power, and be a delegate yourself) Want
                  to receive others votes and{" "}
                  <Typography
                    onClick={() => setOpenDelegation(!openDelegation)}
                    inline
                    variant="h5"
                    color="secondary"
                    css={{ textDecoration: "underline", cursor: "pointer" }}
                  >
                    become a delegate?
                  </Typography>
                </Typography>
              )}
            </Column>
            {!delegationEnabled && (
              <DelegateInputArea>
                <DelegateCard
                  delegate={state.eco.delegate}
                  option={Option.EcoMyWallet}
                />
              </DelegateInputArea>
            )}
          </Column>
        </Column>
      )}
    </Dialog>
  );
};

export default ManageDelegationModal;
