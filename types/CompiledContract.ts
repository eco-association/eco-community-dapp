import { JsonFragment } from "@ethersproject/abi/src.ts/fragments";

export interface CompiledContract {
  abi: ReadonlyArray<JsonFragment>;
  evm: {
    bytecode: {
      functionDebugData: any;
      generatedSources: any;
      linkReferences: any;
      object: string;
      opcodes: string;
      sourceMap: string;
    };
  };
}
