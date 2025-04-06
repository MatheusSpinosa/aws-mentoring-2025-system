/* eslint-disable no-use-before-define */
import dotenv from "dotenv";

import {
  CognitoIdentityProviderClient,
  SignUpCommand,
  ConfirmSignUpCommand,
  ResendConfirmationCodeCommand,
  InitiateAuthCommand,
  AuthFlowType,
  ForgotPasswordCommand,
  ConfirmForgotPasswordCommand,
  type ConfirmForgotPasswordCommandOutput,
  type ForgotPasswordCommandOutput,
  type InitiateAuthCommandOutput,
  type ResendConfirmationCodeCommandOutput,
  type ConfirmSignUpCommandOutput,
  type SignUpCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";
import { generateSecretHash } from "@shared/container/functions/GenerateSecretHash";

import type { IAWSCognitoProvider } from "../IAWSCognitoProvider";

dotenv.config();

export class AWSCognitoProvider implements IAWSCognitoProvider {
  private static instance: AWSCognitoProvider;
  private cognitoClient: CognitoIdentityProviderClient;
  private clientId: string;
  private clientSecret: string;

  private constructor() {
    this.clientId = process.env.COGNITO_CLIENT_ID!;
    this.clientSecret = process.env.COGNITO_CLIENT_SECRET!;
    this.cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.COGNITO_REGION!,
    });
  }

  public static getInstance(): AWSCognitoProvider {
    if (!AWSCognitoProvider.instance) {
      AWSCognitoProvider.instance = new AWSCognitoProvider();
    }
    return AWSCognitoProvider.instance;
  }

  public async signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<SignUpCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );

    const params = {
      ClientId: this.clientId,
      Username: username,
      Password: password,
      UserAttributes: [{ Name: "email", Value: email }],
      SecretHash: secretHash,
    };

    const command = new SignUpCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }

  public async confirmSignUp(
    username: string,
    confirmationCode: string,
  ): Promise<ConfirmSignUpCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      SecretHash: secretHash,
    };

    const command = new ConfirmSignUpCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }

  public async resendConfirmationCode(
    username: string,
  ): Promise<ResendConfirmationCodeCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );
    const params = {
      ClientId: this.clientId,
      Username: username,
      SecretHash: secretHash,
    };

    const command = new ResendConfirmationCodeCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }

  public async signIn(
    username: string,
    password: string,
  ): Promise<InitiateAuthCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );
    const params = {
      AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
      ClientId: this.clientId,
      AuthParameters: {
        USERNAME: username,
        PASSWORD: password,
        SECRET_HASH: secretHash,
      },
    };

    const command = new InitiateAuthCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }

  public async forgotPassword(
    username: string,
  ): Promise<ForgotPasswordCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );
    const params = {
      ClientId: this.clientId,
      Username: username,
      SecretHash: secretHash,
    };

    const command = new ForgotPasswordCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }

  public async confirmForgotPassword(
    username: string,
    confirmationCode: string,
    newPassword: string,
  ): Promise<ConfirmForgotPasswordCommandOutput> {
    const secretHash = generateSecretHash(
      username,
      this.clientId,
      this.clientSecret,
    );
    const params = {
      ClientId: this.clientId,
      Username: username,
      ConfirmationCode: confirmationCode,
      Password: newPassword,
      SecretHash: secretHash,
    };

    const command = new ConfirmForgotPasswordCommand(params);
    const result = await this.cognitoClient.send(command);
    return result;
  }
}
