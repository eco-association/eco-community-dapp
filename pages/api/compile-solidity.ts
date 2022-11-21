import { NextApiRequest, NextApiResponse } from "next";
import { StatusCodes } from "http-status-codes";
import solc from "solc";
import { CompiledContract } from "../../types/CompiledContract";

const handler = (req: NextApiRequest, res: NextApiResponse) => {
  const { fileName, content } = JSON.parse(req.body);

  const compileInput = JSON.stringify({
    language: "Solidity",
    sources: { [fileName]: { content } },
    settings: { outputSelection: { "*": { "*": ["*"] } } },
  });

  const data = JSON.parse(solc.compile(compileInput));
  if (data.errors) {
    res
      .status(StatusCodes.UNPROCESSABLE_ENTITY)
      .json({ errors: data.errors.map((error) => error.formattedMessage) });
  } else {
    const entries: [string, CompiledContract][] = Object.entries(
      data.contracts[fileName]
    );

    const response = entries.reduce((obj, pair) => {
      const [key, value] = pair;
      return {
        ...obj,
        [key]: {
          abi: value.abi,
          evm: {
            bytecode: value.evm.bytecode,
          },
        },
      };
    }, {});

    res.status(StatusCodes.OK).json(response);
  }
};

export default handler;
