import { ERC20Token, Position } from "./utilInterfaces";

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
