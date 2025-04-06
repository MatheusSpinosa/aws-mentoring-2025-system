/* eslint-disable @typescript-eslint/no-explicit-any */
import type { InitiateAuthCommandOutput } from "@aws-sdk/client-cognito-identity-provider";
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  password: string;
}

class CustomerLoginUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<InitiateAuthCommandOutput> {
    const { username, password } = data;

    try {
      const result = await this.awsCognitoProvider.signIn(username, password);
      return result;
    } catch (error: any) {
      throw new AppError(`Erro ao autenticar usuário: ${error?.message}`);
    }
  }
}

export { CustomerLoginUseCase };
