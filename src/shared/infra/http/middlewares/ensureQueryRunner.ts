import { NextFunction, Request, Response } from "express";

import { ManagerConnection } from "@shared/infra/typeorm/ManagerConnections";

export async function ensureQueryRunner(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  request.queryRunner = undefined;
  request.customer = undefined;
  const managerConnections = ManagerConnection.getInstance();
  const queryRunnerInfo = managerConnections.createNewQueryRunner();
  request.queryRunner = queryRunnerInfo;

  response.on("close", () => {
    managerConnections.closeQueryRunner(queryRunnerInfo.id);
  });

  next();
}
