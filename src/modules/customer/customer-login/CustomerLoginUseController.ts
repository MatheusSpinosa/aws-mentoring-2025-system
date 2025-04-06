import { Request, Response } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { CustomerLoginUseCase } from "./CustomerLoginUseCase";

class CustomerLoginUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password } = request.body;

    const useCase = new CustomerLoginUseCase(AWSCognitoProvider.getInstance());
    const result = await useCase.execute({
      username,
      password,
    });

    return response.status(200).json(result);
  }
}

export { CustomerLoginUseController };
