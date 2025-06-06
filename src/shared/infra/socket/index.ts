/* eslint-disable func-names */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { CognitoJwtVerifier } from "aws-jwt-verify";
import type { CognitoJwtVerifierSingleUserPool } from "aws-jwt-verify/cognito-verifier";
import { Server as httpServer } from "http";
import { Server, Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";

import { AuctionBetRepository } from "@modules/auction/infra/repositories/AuctionBetRepository";
import {
  AuctionRepository,
  type ILastAuctionBet,
} from "@modules/auction/infra/repositories/AuctionRepository";
import { BetCashRepository } from "@modules/auction/infra/repositories/BetCashRepository";

import { mySQLConnection } from "../typeorm";
import type { ISendBetDTO, ISocketNotifyDTO } from "./dtos/ISocketDTO";

enum EVENTS {
  CONNECTION = "connection",
  AUTH = "authentication",
  NOTIFICATION = "notification",
  SEND_BET = "new_bet",
  BALANCE = "_balance_",
  VIEWERS = "viewers",
  SERVER_TIME = "server_time",
  SUBSCRIBE = "subscribe",
  GETAUCTIONS = "get_auctions",
  LEAVE = "leave",
  LOGOUT = "logout",
  DISCONNECT = "disconnect",
}

interface IActiveAuctionsList extends ILastAuctionBet {
  timer?: NodeJS.Timeout;
  startTimer?: NodeJS.Timeout;
}

export class SocketService {
  private static io: Server<
    DefaultEventsMap,
    DefaultEventsMap,
    DefaultEventsMap,
    any
  >;

  private static cognitoVerifier: CognitoJwtVerifierSingleUserPool<{
    userPoolId: string;
    tokenUse: "access";
    clientId: string;
  }>;
  public static customerAuth = {} as {
    [customer: string]: { id: string; username: string; balance: any };
  };
  private static activeAuctions = {} as {
    [auctionId: string]: IActiveAuctionsList;
  };
  private static betCashRepository: BetCashRepository;
  private static auctionRepository: AuctionRepository;
  private static auctionBetRepository: AuctionBetRepository;

  private constructor() {}

  public static connection(
    httpServer?: httpServer,
  ): Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any> {
    if (!SocketService.io && httpServer) {
      SocketService.io = new Server(httpServer, {
        cors: {
          origin: "*",
          credentials: true,
        },
      });

      // SocketService._interceptEmits();
      SocketService._socketRoutes();
      SocketService.cognitoVerifier = CognitoJwtVerifier.create({
        userPoolId: process.env.COGNITO_POOL_ID,
        tokenUse: "access",
        clientId: process.env.COGNITO_CLIENT_ID,
      });
      SocketService.betCashRepository = new BetCashRepository();
      SocketService.auctionBetRepository = new AuctionBetRepository();
      SocketService.auctionRepository = new AuctionRepository();
      SocketService.updateAuctionsStart();

      return SocketService.io;
    }

    return SocketService.io;
  }

  public static async updateAuctionsStart(updateStart = true) {
    try {
      await new Promise<void>((resolve) => {
        const checkConnection = async () => {
          const isConnected = mySQLConnection.isInitialized;
          if (isConnected) {
            resolve();
          } else {
            setTimeout(checkConnection, 1000);
          }
        };
        checkConnection();
      });
      if (updateStart) {
        await SocketService.auctionRepository.updateAuctionsStart();
      }
      const result =
        await SocketService.auctionRepository.getAuctionsAndLastBets();
      result.forEach((auction) => {
        const { id } = auction;
        auction.total_bets = Number(auction.total_bets || 0);
        if (SocketService.activeAuctions[id] && updateStart) {
          clearTimeout(SocketService.activeAuctions[id].timer);
        }
        if (updateStart || !SocketService.activeAuctions[id]) {
          SocketService.activeAuctions[id] = auction;
        }
      });
    } catch (error) {
      console.log("Error to update auctions", error);
    }
  }

  // private static _interceptEmits() {
  //   type EmitFunction = (event: string, ...args: any[]) => boolean;
  //   const EMIT_PATCHED = Symbol.for("__emit_patched__");

  //   const addTimestampToEmit = (emitFunction: EmitFunction) => {
  //     return function (this: any, event: string, ...args: any[]) {
  //       const timestamp = new Date().toISOString();
  //       const time = new Date().getTime();
  //       const enhancedArgs = [...args, { timestamp, time }];
  //       return emitFunction.apply(this, [event, ...enhancedArgs]);
  //     };
  //   };

  //   SocketService.io.on(EVENTS.CONNECTION, (socket: Socket) => {
  //     if (!(socket as any)[EMIT_PATCHED]) {
  //       socket.emit = addTimestampToEmit(
  //         socket.emit.bind(socket),
  //       ) as EmitFunction;
  //       (socket as any)[EMIT_PATCHED] = true;
  //     }
  //     if (!(socket.broadcast as any)[EMIT_PATCHED]) {
  //       socket.broadcast.emit = addTimestampToEmit(
  //         socket.broadcast.emit.bind(socket.broadcast),
  //       ) as EmitFunction;
  //       (socket.broadcast as any)[EMIT_PATCHED] = true;
  //     }
  //     if (!(socket.volatile as any)[EMIT_PATCHED]) {
  //       socket.volatile.emit = addTimestampToEmit(
  //         socket.volatile.emit.bind(socket.volatile),
  //       ) as EmitFunction;
  //       (socket.volatile as any)[EMIT_PATCHED] = true;
  //     }
  //   });

  //   if (!(SocketService.io as any)[EMIT_PATCHED]) {
  //     SocketService.io.emit = addTimestampToEmit(
  //       SocketService.io.emit.bind(SocketService.io),
  //     ) as EmitFunction;
  //     (SocketService.io as any)[EMIT_PATCHED] = true;
  //   }

  //   const originalTo = SocketService.io.to.bind(SocketService.io);
  //   SocketService.io.to = function (room: string | string[]) {
  //     const roomObj = originalTo(room);
  //     if (!(roomObj as any)[EMIT_PATCHED]) {
  //       roomObj.emit = addTimestampToEmit(
  //         roomObj.emit.bind(roomObj),
  //       ) as EmitFunction;
  //       (roomObj as any)[EMIT_PATCHED] = true;
  //     }
  //     return roomObj;
  //   };

  //   const originalIn = SocketService.io.in.bind(SocketService.io);
  //   SocketService.io.in = function (room: string | string[]) {
  //     const roomObj = originalIn(room);
  //     if (!(roomObj as any)[EMIT_PATCHED]) {
  //       roomObj.emit = addTimestampToEmit(
  //         roomObj.emit.bind(roomObj),
  //       ) as EmitFunction;
  //       (roomObj as any)[EMIT_PATCHED] = true;
  //     }
  //     return roomObj;
  //   };

  //   const originalLocalEmit = SocketService.io.local.emit.bind(
  //     SocketService.io.local,
  //   );
  //   if (!(SocketService.io.local as any)[EMIT_PATCHED]) {
  //     SocketService.io.local.emit = addTimestampToEmit(
  //       originalLocalEmit,
  //     ) as EmitFunction;
  //     (SocketService.io.local as any)[EMIT_PATCHED] = true;
  //   }
  // }

  private static async validateToken(
    token: string,
  ): Promise<{ sub: string; username: string }> {
    if (!token || typeof token != "string") {
      return null;
    }
    try {
      const { sub, username } = await SocketService.cognitoVerifier.verify(
        `${token}`,
      );

      return { sub, username };
    } catch (error) {
      console.log("Error to validate token", error);
      return null;
    }
  }

  private static _socketRoutes() {
    SocketService.io.on(EVENTS.CONNECTION, async (socket: Socket) => {
      socket.on(EVENTS.SERVER_TIME, () => {
        const timestamp = new Date().toISOString();
        const time = new Date().getTime();
        socket.emit(EVENTS.SERVER_TIME, { timestamp, time });
      });

      socket.on(EVENTS.AUTH, async (token) => {
        const result = await SocketService.validateToken(token);
        if (!result || !SocketService.betCashRepository) {
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "Is not possible authenticate this customer",
            },
          });
          return;
        }
        const balance = await SocketService.betCashRepository.balance(
          result.sub,
        );

        SocketService.customerAuth[`${socket.id}`] = {
          id: result.sub,
          username: result.username,
          balance,
        };
        socket.emit(EVENTS.BALANCE, balance);
      });

      // --- Send bet --- //
      socket.on(EVENTS.SEND_BET, async (data: ISendBetDTO) => {
        if (!data?.auction || typeof data?.auction != "number") {
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "Auction not found",
            },
          });
          return;
        }

        const customer = SocketService.customerAuth[socket.id];
        if (!customer) {
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "Login is required",
            },
          });
          return;
        }

        if (customer.balance.balance < 1) {
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "You don't have enough balance",
            },
          });
          return;
        }

        // --- Compare auction time with current time --- //
        const auction = SocketService.activeAuctions[data.auction];
        if (!auction || auction.status != "a") {
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "Invalid auction or auction data",
            },
          });
          return;
        }

        const currentTime = Date.now();
        const startTime = new Date(auction.startDate).getTime();
        const auctionStartTime = startTime + auction.counter * 1000;
        if (auction.last_bet_createdAt && auctionStartTime < currentTime) {
          const lastBetTime = new Date(auction.last_bet_createdAt).getTime();
          const auctionEndTime = lastBetTime + auction.counter * 1000;

          if (auctionEndTime < currentTime) {
            this.notify(socket.id, {
              type: "error",
              data: {
                message: "Auction has already ended",
              },
            });
            return;
          }
          if (auctionStartTime > currentTime) {
            this.notify(socket.id, {
              type: "error",
              data: {
                message: "Auction has not started yet",
              },
            });
            return;
          }
        }

        // --- Send action bet --- //
        try {
          // --- Update balance --- //
          customer.balance.balance -= 1;
          customer.balance.debit += 1;
          SocketService.customerAuth[socket.id] = customer;

          const [bet] = await Promise.all([
            SocketService.auctionBetRepository.create({
              auction: data.auction,
              customer: customer.id,
            }),
            SocketService.betCashRepository.create({
              customer: customer.id,
              amount: 1,
              type: "d",
              createdAt: new Date(),
            }),
          ]);
          // --- Update auction --- //
          SocketService.activeAuctions[data.auction].last_bet_createdAt =
            bet.createdAt;
          SocketService.activeAuctions[data.auction].last_bet_id = bet.id;
          SocketService.activeAuctions[data.auction].last_bet_customer =
            customer.id;
          SocketService.activeAuctions[data.auction].last_bet_customer_name =
            customer.username;
          SocketService.activeAuctions[data.auction].total_bets += 1;

          // --- Clear old timer --- //
          const oldTimeOut = SocketService.activeAuctions[data.auction].timer;
          if (oldTimeOut) {
            clearTimeout(oldTimeOut);
          }

          // --- Update timer considering startDate --- //
          const { counter, startDate } =
            SocketService.activeAuctions[data.auction];
          const now = Date.now();
          const auctionStart = new Date(startDate).getTime();
          let timeoutDuration = counter * 1000;

          // If auction hasn't started yet, wait until it starts plus counter
          // console.log("auctionStart", auctionStart);
          // console.log("now", now, now < auctionStart);
          // console.log("TIMER", auctionStart - now);
          if (now < auctionStart) {
            timeoutDuration = auctionStart - now + counter * 1000;
            if (SocketService.activeAuctions[data.auction]?.startTimer) {
              clearTimeout(
                SocketService.activeAuctions[data.auction]?.startTimer,
              );
            }
            SocketService.activeAuctions[data.auction].startTimer = setTimeout(
              () => {
                const ac = { ...SocketService.activeAuctions[data.auction] };
                delete ac.startTimer;
                if (ac.timer) {
                  delete ac.timer;
                }
                SocketService.io.emit(`_${data.auction}_`, ac);
              },
              auctionStart - now + 1500,
            );
          } else {
            // If auction already started, calculate remaining time
            const lastBetTime = SocketService.activeAuctions[data.auction]
              .last_bet_createdAt
              ? new Date(
                  SocketService.activeAuctions[data.auction].last_bet_createdAt,
                ).getTime()
              : auctionStart;
            const auctionEndTime = lastBetTime + counter * 1000;
            timeoutDuration = Math.max(auctionEndTime - now, 0);
          }

          SocketService.activeAuctions[data.auction].timer = setTimeout(
            async () => {
              await SocketService.auctionRepository.updateAuctionWinner(
                data.auction,
                customer.id,
              );
              SocketService.activeAuctions[data.auction] = {
                ...SocketService.activeAuctions[data.auction],
                winner: customer.id,
                status: "e",
                endDate: new Date(),
              };

              SocketService.io.emit(
                `_${auction.id}_`,
                SocketService.activeAuctions[data.auction],
              );
            },
            timeoutDuration,
          );
          const message = { ...SocketService.activeAuctions[data.auction] };
          delete message.timer;
          delete message.startTimer;
          SocketService.io.emit(`_${auction.id}_`, message);
          socket.emit("_balance_", customer.balance);
        } catch (error) {
          // --- Update balance --- //
          customer.balance.balance += 1;
          customer.balance.debit -= 1;
          SocketService.customerAuth[socket.id] = customer;
          this.notify(socket.id, {
            type: "error",
            data: {
              message: "Error to send bet",
            },
          });
        }
      });

      socket.on(EVENTS.BALANCE, async (data) => {
        const customer = SocketService.customerAuth[socket.id];

        if (!customer) {
          return;
        }
        if (data == true) {
          try {
            const balance = await this.betCashRepository.balance(customer.id);
            SocketService.customerAuth[socket.id].balance = balance;
            customer.balance = balance;
          } catch {
            //
          }
        }
        socket.emit(EVENTS.BALANCE, customer.balance);
      });

      // --- Get auctions --- //
      socket.on(EVENTS.GETAUCTIONS, () => {
        socket.emit(EVENTS.GETAUCTIONS, SocketService.activeAuctions);
      });

      // --- Check online customer --- //
      socket.on(EVENTS.VIEWERS, async () => {
        const numClients = SocketService.io.sockets.sockets.size;

        socket.emit(EVENTS.VIEWERS, {
          viewers: numClients,
        });
      });

      // --- Logout --- //
      socket.on(EVENTS.LOGOUT, async () => {
        delete SocketService.customerAuth[socket.id];
      });

      // --- Disconnected --- //
      socket.on(EVENTS.DISCONNECT, async () => {
        delete SocketService.customerAuth[socket.id];
      });
    });
  }

  public static notify(socketId: string, data: ISocketNotifyDTO) {
    if (!SocketService.io) {
      return;
    }

    SocketService.io.to(socketId).emit(EVENTS.NOTIFICATION, {
      ...data,
    });
  }
}
