## Subgraphs

**[Cyber Gear NFT](https://thegraph.com/studio/subgraph/cybergear-nft/)**: Tracks all Cyber Gear NFT.

**[Cyber Gear Box](https://thegraph.com/studio/subgraph/cybergear-box)**: Tracks all Cyber Gear Box.

**[Cyber Gear Shards](https://thegraph.com/studio/subgraph/cybergear-shards)**: Tracks all Cyber Gear Shards.

**[Market](https://thegraph.com/studio/subgraph/funtopia-market)**: Tracks all NFTs in market.

## Dependencies

- [Graph CLI](https://github.com/graphprotocol/graph-cli)
    - Required to generate and build local GraphQL dependencies.

```shell
npm install -g @graphprotocol/graph-cli
```

## Deployment

1. Run `graph auth` to authenticate with your deploy key.

2. Type `cd subgraphs/[subgraph]` to enter the subgraph.

3. Run the `graph codegen` command to prepare the TypeScript sources for the GraphQL (generated/*).

4. Run the `graph build` command to build the subgraph, and check compilation errors before deploying.

5. Run `graph deploy --studio [subgraph]` to deploy the subgraph.