import { ERC20Token, Position } from "./utilInterfaces";

export interface SaleInfo {
    tokenId: number;
    originalOwner: string;
    priceInEther: number;
    pairing: ERC20Token[];
    position: Position;
}
