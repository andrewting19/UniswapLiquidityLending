import { ERC20Token, Position } from "./utilInterfaces";

export interface OptionInfo {
    tokenId: number;
    currentOwner: string;
    price: number;
    tokenLong: string;
    forSale: boolean;
    paymentToken: string;
    expiryDate: Date | null;
    pairing: ERC20Token[];
    position: Position;
}
