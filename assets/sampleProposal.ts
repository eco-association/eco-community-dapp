const sampleProposal = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/** @title Proposal
 * Interface specification for proposals. Any proposal submitted in the
 * policy decision process must implement this interface.
 */
abstract contract Proposal {
    /** The name of the proposal.
     *
     * This should be relatively unique and descriptive.
     */
    function name() external view virtual returns (string memory);

    /** A longer description of what this proposal achieves.
     */
    function description() external view virtual returns (string memory);

    /** A URL where voters can go to see the case in favour of this proposal,
     * and learn more about it.
     */
    function url() external view virtual returns (string memory);

    /** Called to enact the proposal.
     *
     * This will be called from the root policy contract using delegatecall,
     * with the direct proposal address passed in as _self so that storage
     * data can be accessed if needed.
     *
     * @param _self The address of the proposal contract.
     */
    function enacted(address _self) external virtual;
}


/** @title MyProposal
 * A proposal to make some change
 */
contract MyProposal is Proposal {

    /** Instantiate a new proposal.
     */
    constructor() {

    }

    /** The name of the proposal.
     */
    function name() public pure override returns (string memory) {
        return "";
    }

    /** A description of what the proposal does.
     */
    function description() public pure override returns (string memory) {
        return "";
    }

    /** A URL where more details can be found.
     */
    function url() public pure override returns (string memory) {
        return "";
    }

    /** Enact the proposal.
     *
     * This is executed in the storage context of the root policy contract.
     *
     * @param _self The address of the proposal.
     */
    function enacted(address _self) public override {
        // Write code here
    }
}`;
export default sampleProposal;
