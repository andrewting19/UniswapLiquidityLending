import { ERC20Token, Position } from "./utilInterfaces";

export interface SwapInfo {
    tokenId: number;
    originalOwner: string;
    renter: string;
    expiryDate:Date;
    durationInSeconds:number;
    pairing: ERC20Token[];
    position: Position;
}
