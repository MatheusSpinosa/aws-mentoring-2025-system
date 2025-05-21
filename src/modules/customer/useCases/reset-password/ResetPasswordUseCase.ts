/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  confirmationCode: string;
  newPassword: string;
}

class ResetPasswordUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username, newPassword, confirmationCode } = data;

    try {
      await this.awsCognitoProvider.confirmForgotPassword(
        username,
        confirmationCode,
        newPassword,
      );
    } catch (error: any) {
      throw new AppError(`Erro ao redefinir senha: ${error?.message}`);
    }
  }
}

export { ResetPasswordUseCase };
