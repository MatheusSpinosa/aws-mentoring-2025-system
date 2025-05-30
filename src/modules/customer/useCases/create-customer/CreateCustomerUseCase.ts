/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from "@errors/AppError";
import type { CustomerRepository } from "@modules/customer/infra/repositories/CustomerRepository";
import type { IAWSCognitoProvider } from "@shared/container/providers/aws-cognito/IAWSCognitoProvider";

interface IRequest {
  username: string;
  password: string;
  email: string;
}

class CreateCustomerUseCase {
  constructor(
    private awsCognitoProvider: IAWSCognitoProvider,
    private customerRepository: CustomerRepository,
  ) {}

  async execute(data: IRequest): Promise<void> {
    let { username, password, email } = data;

    username = username.toLowerCase();
    email = email.toLowerCase().trim();

    try {
      const result = await this.awsCognitoProvider.signUp(
        username,
        password,
        email,
      );

      await this.customerRepository.create({
        userName: username,
        id: result.UserSub,
        email,
        createdAt: new Date(),
      });
    } catch (error: any) {
      throw new AppError(`Erro ao criar usuário: ${error?.message}`);
    }
  }
}

export { CreateCustomerUseCase };
