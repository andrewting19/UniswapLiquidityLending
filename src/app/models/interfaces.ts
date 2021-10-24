import * as internal from "stream";

export interface RentInfo {
    tokenId: number;
    originalOwner: string;
    renter: string | null;
    priceInEther: number;
    durationInSeconds: number; //in seconds
    expiryDate: Date | null;
    pairing: ERC20Token[];
    position: Position;
}

export interface ERC20Token {
    address: string;
    symbol: string;
    name: string;
}

export interface Position {
    tickLower: number;
    tickUpper: number;
    liquidity: number;
    fee: number;
    feeGrowth: number[],
    tokensOwed: number[]
}
