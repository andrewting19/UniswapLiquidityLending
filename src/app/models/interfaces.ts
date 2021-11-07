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

export interface ListingInfo {
    tokenId: number;
    seller: string;
    buyer: string | null;
    priceInEther: number;
    pairing: ERC20Token[];
    position: Position;
}

export interface RentInfo extends ListingInfo {
    durationInSeconds: number; //in seconds
    expiryDate: Date | null;
}

export interface AuctionInfo extends ListingInfo {
    highestBidder: string | null;
    minBid: number;
    durationInSeconds: number; //in seconds
    expiryDate: Date | null;
}

export interface OptionInfo extends ListingInfo {
    premium: number; //in Eth
    costToExercise: number; //in paymentToken
    tokenLong: string;
    forSale: boolean;
    paymentToken: string;
    expiryDate: Date | null;
    pairing: ERC20Token[];
    position: Position;
}

export interface SwapInfo extends ListingInfo {
}

