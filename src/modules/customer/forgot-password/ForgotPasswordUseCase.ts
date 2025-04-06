/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
}

class ForgotPasswordUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username } = data;

    try {
      await this.awsCognitoProvider.forgotPassword(username);
    } catch (error: any) {
      throw new AppError(
        `Erro ao solicitar redefinição de senha: ${error?.message}`,
      );
    }
  }
}

export { ForgotPasswordUseCase };
