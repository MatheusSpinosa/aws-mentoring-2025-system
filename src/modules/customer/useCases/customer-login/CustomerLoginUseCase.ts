/* eslint-disable @typescript-eslint/no-explicit-any */
import { CognitoJwtVerifier } from "aws-jwt-verify";

import { AppError } from "@errors/AppError";
import type { Customer } from "@modules/customer/infra/entities/mysql/Customer";
import type { CustomerRepository } from "@modules/customer/infra/repositories/CustomerRepository";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  password: string;
}

class CustomerLoginUseCase {
  constructor(
    private awsCognitoProvider: IAWSCognitoProvider,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(
    data: IRequest,
  ): Promise<{ customer: Customer; token: string }> {
    const { username, password } = data;

    try {
      const result = await this.awsCognitoProvider.signIn(username, password);

      const userPoolId = process.env.COGNITO_POOL_ID;
      const clientId = process.env.COGNITO_CLIENT_ID;

      const verifier = CognitoJwtVerifier.create({
        userPoolId,
        tokenUse: "access",
        clientId,
      });
      const payload = await verifier.verify(
        result?.AuthenticationResult?.AccessToken,
      );

      const customer = {
        id: payload.sub,
        userName: payload.username,
        email: payload.username,
      };

      const customerData = await this.customerRepository.findById(customer.id);

      return {
        customer: customerData,
        token: `Bearer ${result?.AuthenticationResult?.AccessToken}`,
      };
    } catch (error: any) {
      throw new AppError(`Erro ao autenticar usuário: ${error?.message}`);
    }
  }
}

export { CustomerLoginUseCase };
