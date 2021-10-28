def getLastXSwaps(pool_id, num_swaps):
  url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
  query = """
    query ($max_timestamp: String! $pool_id: String!) {
      pool(id: $pool_id){
        swaps(where:{timestamp_lt: $max_timestamp} first:1000 orderBy:timestamp orderDirection:desc){
          amount0
          amount1
          timestamp
        }
      }
    }
  """
  res, done, max_timestamp = [], False, "9999999999"
  total = 0
  while not done:
    variables = {"max_timestamp": max_timestamp, "pool_id": pool_id}
    r = requests.post(url, json={"query": query , "variables": variables})
    try: temp = json.loads(r.text)["data"]["pool"]["swaps"]
    except: print("ERROR", r.text)
    res.extend(i)
    last_time_stamp = temp[-1]["timestamp"]
    total += len(temp)
    if total >= num_swaps or len(temp) < num_swaps
      done = True #Need at least 10k swaps or last 90 days of swaps
    else:
      max_timestamp = last_time_stamp
  return res



  def getSwapsFromLastXDays(pool_id,num_days, curr_time): #curr_time is current block time in epoch seconds
  url = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3"
  query = """
    query ($max_timestamp: String! $pool_id: String!) {
      pool(id: $pool_id){
        swaps(where:{timestamp_lt: $max_timestamp} first:1000 orderBy:timestamp orderDirection:desc){
          amount0
          amount1
          timestamp
        }
      }
    }
  """
  res, done, max_timestamp = [], False, "9999999999"
  total = 0
  end_time_stamp = curr_time - (86400 * num_days) 
  end_time_stamp = 0 if end_time_stamp < 0
  while not done:
    variables = {"max_timestamp": max_timestamp, "pool_id": pool_id}
    r = requests.post(url, json={"query": query , "variables": variables})
    try: temp = json.loads(r.text)["data"]["pool"]["swaps"]
    except: print("ERROR", r.text)
    res.extend(i)
    last_time_stamp = temp[-1]["timestamp"]
    total += len(temp)
    l
    if int(last_time_stamp) < c or len(temp) < 1000:
      done = True 
    else:
      max_timestamp = last_time_stamp
  return res