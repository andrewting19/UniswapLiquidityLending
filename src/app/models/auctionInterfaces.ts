import { ERC20Token, Position } from "./utilInterfaces";

export interface AuctionInfo {
    tokenId: number;
    originalOwner: string;
    highestBidder: string | null;
    minBid: number;
    priceInEther: number;
    durationInSeconds: number; //in seconds
    expiryDate: Date | null;
    pairing: ERC20Token[];
    position: Position;
}
