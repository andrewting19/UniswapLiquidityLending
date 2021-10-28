import { execPath } from "process";

const axios = require('axios').default;

const url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";




async function getLastXSwaps(poolAddress: string, numSwaps: number) {
    const query = `
    query ($max_timestamp: String! $pool_addr: String!) {
      pool(id: $pool_addr){
        swaps(where:{timestamp_lt: $max_timestamp} first:1000 orderBy:timestamp orderDirection:desc){
          amount0
          amount1
          amountUSD
          timestamp
          tick
        }
      }
    }
    `;

    let res = Array<any>();
    let done = false;
    const max_timestamp = "9999999999";
    let total = 0;
    while (!done) {
        const variables = { "max_timestamp": max_timestamp, "pool_id": poolAddress };
        const response =  await axios.post(url, JSON.parse(`query: ${query} variables: ${variables}`));
                try {
                    const swaps = JSON.parse(response)["data"]["pool"]["swaps"];
                    res.push(...swaps);
                    total += swaps.length;
                    if (total >= numSwaps || swaps.length < 1000) {
                        done = true;
                    }
                } catch (error) {
                    console.log(res);
                    throw(error);
                }  
            
        return res;

        }

    }

async function getPoolInfo (poolAddress: string) {
    const query = `
    query ($pool_addr: String!) {
        pool(id: $pool_addr){
            token0
            token1
            feeTier
            liquidity
            token0price
            token1price
            txCount
            totalValueLockedToken0
            totalValueLockedToken1
            totalValueLockedETH
            totalValueLockedUSD
            liquidityProviderCount
            swaps

          
        }
      }
        `;
    const variables = { "pool_id": poolAddress };
    const response =  await axios.post(url, JSON.parse(`query: ${query} variables: ${variables}`));





}

