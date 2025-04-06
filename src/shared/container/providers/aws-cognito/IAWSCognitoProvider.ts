import {
  SignUpCommandOutput,
  ConfirmSignUpCommandOutput,
  ResendConfirmationCodeCommandOutput,
  InitiateAuthCommandOutput,
  ForgotPasswordCommandOutput,
  ConfirmForgotPasswordCommandOutput,
} from "@aws-sdk/client-cognito-identity-provider";

export interface IAWSCognitoProvider {
  signUp(
    username: string,
    password: string,
    email: string,
  ): Promise<SignUpCommandOutput>;

  confirmSignUp(
    username: string,
    confirmationCode: string,
  ): Promise<ConfirmSignUpCommandOutput>;

  resendConfirmationCode(
    username: string,
  ): Promise<ResendConfirmationCodeCommandOutput>;

  signIn(
    username: string,
    password: string,
  ): Promise<InitiateAuthCommandOutput>;

  forgotPassword(username: string): Promise<ForgotPasswordCommandOutput>;

  confirmForgotPassword(
    username: string,
    confirmationCode: string,
    newPassword: string,
  ): Promise<ConfirmForgotPasswordCommandOutput>;
}
