import { useCallback, useMemo, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { toast } from "@ecoinc/ecomponents-old";
import { StatusCodes } from "http-status-codes";
import { useAccount, useProvider, useSigner } from "wagmi";
import { tokensToNumber, txError } from "../../utilities";
import { useECO } from "./contract/useECO";
import { toast as nativeToast } from "react-toastify";
import {
  ProposalsTab,
  useProposalTabContext,
} from "../../providers/ProposalTabProvider";
import {
  PolicyProposals__factory,
  Proposal__factory,
} from "../../types/contracts/factories";
import { CompiledContract } from "../../types/CompiledContract";
import { ECO } from "../../types/contracts/ECO";
import { PolicyProposals } from "../../types/contracts";
import { Zero } from "@ethersproject/constants";
import { ProposalType } from "../../types";
import { ContractCallContext, Multicall } from "ethereum-multicall";
import { ToastOptions } from "react-toastify/dist/types";
import { useCommunity, useContractAddresses } from "../../providers";
import { CommunityActionType } from "../../providers/CommunityProvider";
import { formatNumber } from "@ecoinc/ecomponents";

export enum Status {
  Deploying = "Deploying...",
  Submitting = "Submitting...",
  Approving = "Approving Tokens...",
}

class SubmitProposal {
  private readonly policyProposal: PolicyProposals;
  private registerCost: BigNumber;

  constructor(
    private readonly address: string,
    public readonly provider: ethers.providers.BaseProvider,
    public readonly signer: ethers.Signer,
    private readonly eco: ECO,
    policyProposals: string
  ) {
    this.policyProposal = PolicyProposals__factory.connect(
      policyProposals,
      this.provider
    );
  }

  public static async compileContract(
    code: string
  ): Promise<
    | { successful: false; errors: string[] }
    | { successful: true; result: Record<string, CompiledContract> }
  > {
    try {
      const response = await fetch("/api/compile-solidity", {
        method: "POST",
        body: JSON.stringify({ fileName: "contract.sol", content: code }),
      });

      const result = await response.json();

      if (response.status === StatusCodes.UNPROCESSABLE_ENTITY) {
        return { successful: false, errors: result.errors as string[] };
      }
      return {
        successful: true,
        result: result as Record<string, CompiledContract>,
      };
    } catch (error) {
      return {
        successful: false,
        errors: ["Unknown error, please try again later"],
      };
    }
  }

  private static proposalMulticallContext(
    contractAddress: string
  ): ContractCallContext {
    return {
      reference: "proposal",
      contractAddress,
      abi: Proposal__factory.abi,
      calls: [
        { reference: "name", methodName: "name", methodParameters: [] },
        { reference: "url", methodName: "url", methodParameters: [] },
        {
          reference: "description",
          methodName: "description",
          methodParameters: [],
        },
      ],
    };
  }

  async getRegisterCost(): Promise<BigNumber> {
    if (!this.registerCost) {
      this.registerCost = await this.policyProposal.COST_REGISTER();
    }
    return this.registerCost;
  }

  async getApproveAmountRequired(): Promise<BigNumber> {
    const requiredAllowance = await this.getRegisterCost();
    const allowance = await this.eco.allowance(
      this.address,
      this.policyProposal.address
    );
    if (requiredAllowance.gt(allowance)) {
      return requiredAllowance.sub(allowance);
    }
    return Zero;
  }

  async hasEnoughEco(): Promise<boolean> {
    const cost = await this.getRegisterCost();
    const balance = await this.eco.balanceOf(this.address);
    return balance.gte(cost);
  }

  async approve(amount: BigNumber) {
    const approveTx = await this.eco.approve(
      this.policyProposal.address,
      amount
    );
    await approveTx.wait();
  }

  async submit(proposalAddress: string): Promise<ProposalType> {
    const submitTx = await this.policyProposal
      .connect(this.signer)
      .registerProposal(proposalAddress);
    await submitTx.wait();

    const proposalData = await this.getProposalData(proposalAddress);

    return {
      ...proposalData,
      id: `${this.policyProposal.address.toLowerCase()}-${proposalAddress.toLowerCase()}`,
      proposer: this.address,
      address: proposalAddress.toLowerCase(),
      refunded: false,
      supported: false,
      totalStake: Zero,
      reachedSupportThreshold: false,
    };
  }

  async deploy(code: CompiledContract): Promise<string> {
    const factory = new ethers.ContractFactory(
      code.abi,
      code.evm.bytecode,
      this.signer
    );
    const tx = await factory.deploy();
    const receipt = await tx.deployTransaction.wait();
    return receipt.contractAddress;
  }

  public async getProposalData(proposalAddress: string) {
    const multicall = new Multicall({
      ethersProvider: this.provider,
      tryAggregate: true,
    });
    const { results } = await multicall.call(
      SubmitProposal.proposalMulticallContext(proposalAddress)
    );

    const data = results.proposal.callsReturnContext.flatMap(
      (call) => call.returnValues
    );

    const [name = "", url = "", description = ""] = data;
    return { name, description, url };
  }
}

const successToast: ToastOptions = {
  position: "top-center",
  autoClose: 5000,
  hideProgressBar: true,
  progress: undefined,
  theme: "colored",
  style: {
    backgroundColor: "#F7FEFC",
    border: "solid 1px #5AE4BF",
    color: "#22313A",
    top: "115px",
  },
};

const useDeployProposal = () => {
  const eco = useECO();
  const account = useAccount();
  const provider = useProvider();
  const { data: signer } = useSigner();
  const { dispatch } = useCommunity();
  const { policyProposals } = useContractAddresses();

  const flow = useMemo(
    () =>
      new SubmitProposal(
        account.address,
        provider,
        signer,
        eco,
        policyProposals.toString()
      ),
    [account.address, eco, policyProposals, provider, signer]
  );

  const { setActive } = useProposalTabContext();

  const [loading, setLoading] = useState(false);
  const [compiling, setCompiling] = useState(false);

  const [status, setStatus] = useState<Status>(null);
  const [listTransactions, setListTransactions] = useState<Status[]>([]);

  const [compilation, setCompilation] = useState<
    Record<string, CompiledContract>
  >({});
  const [compilationErrors, setCompilationErrors] = useState<string[]>([]);

  const compileProposal = useCallback(async (code: string) => {
    setCompilationErrors([]);
    setCompilation({});
    setCompiling(true);
    try {
      const result = await SubmitProposal.compileContract(code);

      if (result.successful === false) {
        toast({
          title: "Compilation Failed",
          intent: "danger",
        });
        setCompilationErrors(result.errors);
      } else {
        // Filter out non-deployable contracts
        const contracts = Object.fromEntries(
          Object.entries(result.result).filter(
            (pair) => pair[1].evm.bytecode.object.length
          )
        );
        setCompilation(contracts);
      }
    } catch (error) {
      toast({
        title: "Compilation Failed",
        intent: "danger",
        body: error.message,
      });
    }
    setCompiling(false);
  }, []);

  const _checkBalance = async () => {
    try {
      const hasEnough = await flow.hasEnoughEco();
      if (!hasEnough) {
        txError(
          "Not enough ECO",
          new Error(
            `You need ${formatNumber(
              tokensToNumber(await flow.getRegisterCost())
            )} ECO to pay the submission fee`
          )
        );
        return false;
      }
    } catch (e) {}
    return true;
  };

  const _submit = async (proposalAddress: string) => {
    try {
      const amountRequired = await flow.getApproveAmountRequired();
      if (!amountRequired.isZero()) {
        setStatus(Status.Approving);
        await flow.approve(amountRequired);
      } else {
        // Remove approve action
        setListTransactions((state) =>
          state.filter((action) => action !== Status.Approving)
        );
      }
    } catch (error) {
      txError("Failed to approve tokens", error);
      setStatus(null);
      setLoading(false);
      return;
    }

    try {
      setStatus(Status.Submitting);
      const proposal = await flow.submit(proposalAddress);
      setLoading(false);

      dispatch({
        type: CommunityActionType.NewProposal,
        proposal,
      });

      // Move to Active Proposals tab
      setActive(ProposalsTab.Active);
      nativeToast(`🚀 Successfully submitted proposal`, successToast);

      return proposal;
    } catch (error) {
      txError("Failed to Submit Proposal", error);
      setStatus(null);
      setLoading(false);
    }
  };

  const submitProposal = async (proposalAddress: string) => {
    setLoading(true);
    setListTransactions([Status.Approving, Status.Submitting]);

    if (!(await _checkBalance())) {
      setLoading(false);
      setStatus(null);
      return;
    }

    return _submit(proposalAddress);
  };

  const deployAndSubmitProposal = async (code: CompiledContract) => {
    setLoading(true);
    setStatus(Status.Deploying);
    setListTransactions([
      Status.Deploying,
      Status.Approving,
      Status.Submitting,
    ]);

    if (!(await _checkBalance())) {
      setLoading(false);
      setStatus(null);
      return;
    }

    try {
      const address = await flow.deploy(code);
      return _submit(address);
    } catch (error) {
      txError("Failed to Deploy Proposal", error);
      setStatus(null);
    }
    setLoading(false);
  };

  return {
    submitProposal,
    deployAndSubmitProposal,
    compileProposal,
    loading,
    compiling,
    status,
    compilation,
    listTransactions,
    compilationErrors,
  };
};

export default useDeployProposal;
