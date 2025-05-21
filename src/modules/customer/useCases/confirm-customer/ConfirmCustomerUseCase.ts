/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  confirmationCode: string;
}

class ConfirmCustomerUseCase {
  constructor(private awsCognitoProvider: IAWSCognitoProvider) {}

  async execute(data: IRequest): Promise<void> {
    const { username, confirmationCode } = data;

    try {
      await this.awsCognitoProvider.confirmSignUp(username, confirmationCode);
    } catch (error: any) {
      throw new AppError(`Erro ao confirmar usuário: ${error?.message}`);
    }
  }
}

export { ConfirmCustomerUseCase };
