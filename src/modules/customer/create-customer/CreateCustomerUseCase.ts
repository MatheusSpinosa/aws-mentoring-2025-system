/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  password: string;
  email: string;
}

class CreateCustomerUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username, password, email } = data;

    try {
      await this.awsCognitoProvider.signUp(username, password, email);
    } catch (error: any) {
      throw new AppError(`Erro ao criar usuário: ${error?.message}`);
    }
  }
}

export { CreateCustomerUseCase };
