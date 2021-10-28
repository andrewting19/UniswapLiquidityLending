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
                    console.log(response);
                    throw(error);
                }  
            
        return res;

        }

    }



  async function  getSwapsFromLastXDays(poolAddress: string, numDays: number, currTime: number) {
      const query = `
      query ($min_timestamp: String! $pool_addr: String!) {
        pool(id: $pool_addr){
          swaps(where:{timestamp_gt: $min_timestamp} orderBy:timestamp orderDirection:desc){
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
      let min_timestamp = currTime - (86400 * numDays) 
      if (min_timestamp < 0) {
        min_timestamp = 0;
      }
      const variables = { "min_timestamp": min_timestamp, "pool_id": poolAddress };
      const response =  await axios.post(url, JSON.parse(`query: ${query} variables: ${variables}`));
  
        try {
              const swaps = JSON.parse(response)["data"]["pool"]["swaps"];
              res = swaps
              } catch (error) {
                  console.log(response);
                  throw(error);
            }  
              
          return res;
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
    try {
      const poolData = JSON.parse(response)["data"]["pool"];
      return poolData;
    } catch (error) {
      console.log(response);
      throw(error);
  }  

}

async function getFeeTierDistribution(token0: string, token1: string) {
  const query = `feeTierDistribution($token0: String!, $token1: String!) {
    _meta {
      block {
        number
      }
    }
    asToken0: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token0, token1: $token1 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
    asToken1: pools(
      orderBy: totalValueLockedToken0
      orderDirection: desc
      where: { token0: $token1, token1: $token0 }
    ) {
      feeTier
      totalValueLockedToken0
      totalValueLockedToken1
    }
  }`;
}


