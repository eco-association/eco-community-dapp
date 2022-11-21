# The ECO Community Governance Interface

The community governance dApp provides an open source interface for ECO and ECOx holders to do community governance in the ECO protocol and upgrade any part of the system. The dApp also provides a single place to interact with the monetary levers present in the protocol.

- Website: [eco.org](https://eco.org/)
- Docs: [docs.eco.org](https://docs.eco.org/)
- Discord: [discord.eco.org](https://discord.eco.org/)
- Governance Discourse: [https://forums.eco.org/c/egp/11](https://forums.eco.org/c/egp/11)

## Deployment

The dApp can be found deployed at: [governance.eco.org](https://governance.eco.org/). The subgraphs being used by the dApp can be found at: [https://thegraph.com/hosted-service/subgraph/ecographs/the-eco-currency-subgraphs](https://thegraph.com/hosted-service/subgraph/ecographs/the-eco-currency-subgraphs).

### Getting Started

After cloning the repo, run npm install to install all required packages.

Next, be sure to set the required environment variables, notably the subgraph URI. See .env.example for more details.

To run the app locally:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Configuration

In order to sync to a specific deployment of contracts, this app requires the following to be set up:

#### CHAIN

Use the env variable `NEXT_PUBLIC_CHAIN` to set the network that the app will allow users to connect on, (examples: `mainnet`, `goerli`, `localhost`)

#### SUBGRAPH

This app uses the [The ECO Currency Subgraphs](https://thegraph.com/hosted-service/subgraph/ecographs/the-eco-currency-subgraphs) to get information about the Eco Protocol, wherever the subgraph can be accessed for queries, assign that endpoint to the `NEXT_PUBLIC_SUBGRAPH_URI` env variable.

To see a full list of the the env vars, check out the example [here](./.env.example)

## Contributing

Contributions are welcome. Please submit any issues as issues on GitHub, and open a pull request with any contributions.

## License

[MIT (c) ECO Association](./LICENSE)
