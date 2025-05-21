import { Request, Response } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { ConfirmCustomerSendCodeUseCase } from "./ConfirmCustomerSendCodeUseCase";

class ConfirmCustomerSendCodeUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username } = request.body;

    const useCase = new ConfirmCustomerSendCodeUseCase(
      AWSCognitoProvider.getInstance(),
    );
    const result = await useCase.execute({
      username,
    });

    return response.status(200).json(result);
  }
}

export { ConfirmCustomerSendCodeUseController };
