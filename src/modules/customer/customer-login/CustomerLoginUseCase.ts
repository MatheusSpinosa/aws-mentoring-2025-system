/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  password: string;
}

class CustomerLoginUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username, password } = data;

    try {
      await this.awsCognitoProvider.signIn(username, password);
    } catch (error: any) {
      throw new AppError(`Erro ao autenticar usuário: ${error?.message}`);
    }
  }
}

export { CustomerLoginUseCase };
