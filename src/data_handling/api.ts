import { execPath } from "process";

const axios = require("axios");

const url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";




function getLastXSwaps (poolAddress: string, numSwaps: number) : any{
    const query = `
    query ($max_timestamp: String! $pool_addr: String!) {
      pool(id: $pool_addr){
        swaps(where:{timestamp_lt: $max_timestamp} first:1000 orderBy:timestamp orderDirection:desc){
          amount0
          amount1
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
        const req = axios.post(url, JSON.parse(`query: ${query} variables: ${variables}`) ).then(
            response)=>  {
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
                
            }

            );

        return res;


    }

}

