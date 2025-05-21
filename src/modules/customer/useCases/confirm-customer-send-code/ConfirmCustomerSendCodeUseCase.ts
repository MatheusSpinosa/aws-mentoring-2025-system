/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
}

class ConfirmCustomerSendCodeUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username } = data;

    try {
      await this.awsCognitoProvider.resendConfirmationCode(username);
    } catch (error: any) {
      throw new AppError(
        `Erro ao reenviar código de confirmação: ${error?.message}`,
      );
    }
  }
}

export { ConfirmCustomerSendCodeUseCase };
