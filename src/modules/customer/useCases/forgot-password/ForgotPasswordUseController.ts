import { Request, Response } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { ForgotPasswordUseCase } from "./ForgotPasswordUseCase";

class ForgotPasswordUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username } = request.body;

    const useCase = new ForgotPasswordUseCase(AWSCognitoProvider.getInstance());
    const result = await useCase.execute({
      username,
    });

    return response.status(200).json(result);
  }
}

export { ForgotPasswordUseController };
