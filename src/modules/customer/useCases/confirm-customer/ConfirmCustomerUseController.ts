import { Request, Response } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { ConfirmCustomerUseCase } from "./ConfirmCustomerUseCase";

class ConfirmCustomerUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, confirmationCode } = request.body;

    const useCase = new ConfirmCustomerUseCase(
      AWSCognitoProvider.getInstance(),
    );
    const result = await useCase.execute({
      username,
      confirmationCode,
    });

    return response.status(200).json(result);
  }
}

export { ConfirmCustomerUseController };
