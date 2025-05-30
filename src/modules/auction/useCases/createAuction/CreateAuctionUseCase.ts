import type { Auction } from "@modules/auction/infra/entities/mysql/Auction";
import type { AuctionRepository } from "@modules/auction/infra/repositories/AuctionRepository";
import { SaveFile } from "@shared/container/files/SaveFile";
import { SocketService } from "@shared/infra/socket";

interface IRequest {
  customer: string;
  counter: number;
  startDate: number;
  name: string;
  image: string;
}

class CreateAuctionUseCase {
  constructor(private auctionRepository: AuctionRepository) {}

  async execute({
    customer,
    counter,
    image,
    name,
    startDate,
  }: IRequest): Promise<Auction> {
    console.log(customer, counter, image.slice(0, 50), name, startDate);
    if (!customer || !counter || !image || !name || !startDate) {
      throw new Error("Missing required fields");
    }

    // --- Check if have image --- //
    const acceptMimeTypes = {
      "image/jpg": "jpg",
      "image/jpeg": "jpg",
      "image/png": "png",
    };

    // --- Check mime type and save file --- //
    const file = await SaveFile({
      file: image,
      acceptMimeTypes,
      preString: ``,
    });

    const auction = await this.auctionRepository.create({
      counter,
      customer,
      image: file,
      name,
      startDate: new Date(startDate),
      endDate: null,
      status: "a",
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await SocketService.updateAuctionsStart(false);

    return auction;
  }
}

export { CreateAuctionUseCase };
