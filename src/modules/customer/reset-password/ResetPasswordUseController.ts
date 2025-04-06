import { Request, Response } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { ResetPasswordUseCase } from "./ResetPasswordUseCase";

class ResetPasswordUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, newPassword, confirmationCode } = request.body;

    const useCase = new ResetPasswordUseCase(AWSCognitoProvider.getInstance());
    const result = await useCase.execute({
      username,
      newPassword,
      confirmationCode,
    });

    return response.status(200).json(result);
  }
}

export { ResetPasswordUseController };
