import { Request, Response } from "express";

import { CustomerRepository } from "@modules/customer/infra/repositories/CustomerRepository";
import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

import { CreateCustomerUseCase } from "./CreateCustomerUseCase";

class CreateCustomerUseController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { username, password, email } = request.body;

    const useCase = new CreateCustomerUseCase(
      AWSCognitoProvider.getInstance(),
      new CustomerRepository(),
    );
    const result = await useCase.execute({
      username,
      password,
      email,
    });

    return response.status(200).json(result);
  }
}

export { CreateCustomerUseController };
