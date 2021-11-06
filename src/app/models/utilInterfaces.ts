
export interface ERC20Token {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
}

export interface Position {
    tickLower: number;
    tickUpper: number;
    liquidity: number;
    fee: number;
    feeGrowth: number[],
    tokensOwed: number[],
    priceRange: PriceRange[]
}

export interface PriceRange {
    lower: number;
    upper: number;
}
