/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";

import { AWSCognitoProvider } from "@shared/container/providers/aws-cognito/implementations/AWSCognitoProvider";

const customerRoutes = Router();

customerRoutes.post("/create", async (req, res) => {
  const { username, password, email } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    const result = await awsCognitoProvider.signUp(username, password, email);
    res.status(201).json(result);
  } catch (error: any) {
    res.status(400).send(`Erro ao criar usuário: ${error?.message}`);
  }
});

customerRoutes.post("/confirm", async (req, res) => {
  const { username, confirmationCode } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    const result = await awsCognitoProvider.confirmSignUp(
      username,
      confirmationCode,
    );
    res.status(200).json(result);
  } catch (error: any) {
    res.status(400).send(`Erro ao confirmar usuário: ${error?.message}`);
  }
});

customerRoutes.post("/resend-confirmation-code", async (req, res) => {
  const { username } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    const result = await awsCognitoProvider.resendConfirmationCode(username);
    res.status(200).json(result);
  } catch (error: any) {
    res
      .status(400)
      .send(`Erro ao reenviar código de confirmação: ${error?.message}`);
  }
});

customerRoutes.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    const authResult = await awsCognitoProvider.signIn(username, password);
    res.status(200).json(authResult);
  } catch (error: any) {
    res.status(401).send(`Erro ao autenticar usuário: ${error?.message}`);
  }
});

customerRoutes.post("/forgot-password", async (req, res) => {
  const { username } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    await awsCognitoProvider.forgotPassword(username);
    res.status(200).send("Código de redefinição de senha enviado com sucesso.");
  } catch (error: any) {
    res
      .status(400)
      .send(`Erro ao solicitar redefinição de senha: ${error?.message}`);
  }
});

customerRoutes.post("/reset-password", async (req, res) => {
  const { username, confirmationCode, newPassword } = req.body;
  const awsCognitoProvider = AWSCognitoProvider.getInstance();

  try {
    await awsCognitoProvider.confirmForgotPassword(
      username,
      confirmationCode,
      newPassword,
    );
    res.status(200).send("Senha redefinida com sucesso.");
  } catch (error: any) {
    res.status(400).send(`Erro ao redefinir senha: ${error?.message}`);
  }
});

export { customerRoutes };
