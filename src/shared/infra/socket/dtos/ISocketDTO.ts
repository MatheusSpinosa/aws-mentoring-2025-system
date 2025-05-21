import type { Auction } from "@modules/auction/infra/entities/mysql/Auction";

/* eslint-disable @typescript-eslint/no-explicit-any */
export interface ISendBetDTO {
  auction: number;
}

export interface ISocketNotifyDTO {
  type: "error";
  data: any;
}

interface ILastUsersBet {
  id: number;
  userName: string;
  date: Date;
}

export interface IGlobalAuctionsAndLastBet extends Auction {
  lastUsersBet?: ILastUsersBet;
}
