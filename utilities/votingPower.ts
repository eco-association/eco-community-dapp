import { ManageDelegationState } from "../components/application/Account/VotingPowerCard/ManageDelegationModal/provider/ManageDelegationProvider";

export function isAdvancedDelegation(state: ManageDelegationState): boolean {
  return (
    state.eco.enabled !== state.secox.enabled ||
    state.eco.delegate !== state.secox.delegate
  );
}
