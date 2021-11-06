import { ERC20Token, Position } from "./utilInterfaces";

export interface OptionInfo {
    tokenId: number;
    currentOwner: string;
    premium: number; //in Eth
    costToExcersize: number; //in paymentToken
    tokenLong: string;
    forSale: boolean;
    paymentToken: string;
    expiryDate: Date | null;
    pairing: ERC20Token[];
    position: Position;
}
