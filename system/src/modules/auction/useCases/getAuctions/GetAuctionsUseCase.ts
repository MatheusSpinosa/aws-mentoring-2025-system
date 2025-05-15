import type {
  AuctionRepository,
  ILastAuctionBet,
} from "@modules/auction/infra/repositories/AuctionRepository";

class GetAuctionsUseCase {
  constructor(private auctionRepository: AuctionRepository) {}

  async execute(): Promise<ILastAuctionBet[]> {
    const auction = await this.auctionRepository.getAuctionsAndLastBets();

    return auction.reverse();
  }
}

export { GetAuctionsUseCase };
