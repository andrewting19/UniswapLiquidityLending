import { execPath } from "process";

const axios = require('axios').default;


export default class graphAPI {

  url: string;


  constructor(url: string) {
    this.url = url;
  }


public async getLastXSwaps(poolAddress: string, numSwaps: number) {
  const query = `
  query ($max_timestamp: String! $pool_addr: String! $num_swaps: Int!) {
    pool(id: $pool_addr){
      swaps(where:{timestamp_lt: $max_timestamp} first:$num_swaps orderBy:timestamp orderDirection:desc){
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
  const variables = { "max_timestamp": max_timestamp, "pool_addr": poolAddress, "num_swaps": numSwaps };
  const response =  await axios.post(this.url,{ "query": query, "variables":variables});

    try {            
        const swaps = response.data.data.pool.swaps;
        res.push(...swaps);
        total += swaps.length;
        return res;
      } catch (error) {
        console.log(response);
        throw(error);
      }  
          
      

  }



public async getSwapsFromLastXDays(poolAddress: string, numDays: number, currTime: number) {
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
    const response =  await axios.post(this.url,{ "query": query, "variables":variables});
    try {
            const swaps = response.data.pool.swaps;
            res = swaps
            } catch (error) {
                console.log(response);
                throw(error);
          }  
            
        return res;
  }




public async getPoolInfo (poolAddress: string) {
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
  const response =  await axios.post(this.url,{ "query": query, "variables":variables});
  try {
    const poolData = response.data.pool;
    return poolData;
  } catch (error) {
    console.log(response);
    throw(error);
}  

}

public async getFeeTierDistribution(token0: string, token1: string) {
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
const variables = { "token0": token0, "token1": token1 };
const response =  await axios.post(this.url,{ "query": query, "variables":variables});
  try {
    const token0Data = response.data.token0;
    const token1Data = response.data.token1;
    return { "token0Data": token0Data, "token1Data": token1Data };
  } catch (error) {
    console.log(response);
    throw(error);
}  
}


public async getTickRangeInfo(poolAddress: string, tickLower: number, tickHigher: number) {
const query = `query ($pool_addr: String!, $tickLower: BigInt!, $tickHigher: BigInt!) {
  pool(id: $pool_addr){
    ticks(where: { id_gte: $tickLower, id_lte: $tickHigher})
    liquidityGross
    price0
    price1
    volumeToken0
    volumeToken1
    volumeUSD
    feesUSD
    collectedFeesUSD
    collectedFeesToken0
    collectedFeesToken1
      
  }
}`;
const variables = { "pool_addr": poolAddress, "tickLower": tickLower, "tickHigher":tickHigher };
const response =  await axios.post(this.url,{ "query": query, "variables":variables});
try {
  const tickData = response.data.ticks;
  return tickData;
} catch (error) {
  console.log(response);
  throw(error);
} 


}





}





