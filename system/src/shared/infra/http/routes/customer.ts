/* eslint-disable @typescript-eslint/no-explicit-any */
import { Router } from "express";

import { ConfirmCustomerSendCodeUseController } from "@modules/customer/useCases/confirm-customer-send-code/ConfirmCustomerSendCodeUseController";
import { ConfirmCustomerUseController } from "@modules/customer/useCases/confirm-customer/ConfirmCustomerUseController";
import { CreateCustomerUseController } from "@modules/customer/useCases/create-customer/CreateCustomerUseController";
import { CustomerLoginUseController } from "@modules/customer/useCases/customer-login/CustomerLoginUseController";
import { ForgotPasswordUseController } from "@modules/customer/useCases/forgot-password/ForgotPasswordUseController";
import { ResetPasswordUseController } from "@modules/customer/useCases/reset-password/ResetPasswordUseController";

const customerRoutes = Router();

const createCustomerUseController = new CreateCustomerUseController();
const confirmCustomerUseController = new ConfirmCustomerUseController();
const confirmCustomerSendCodeUseController =
  new ConfirmCustomerSendCodeUseController();
const customerLoginUseController = new CustomerLoginUseController();
const forgotPasswordUseController = new ForgotPasswordUseController();
const resetPasswordUseController = new ResetPasswordUseController();

customerRoutes.post("/create", createCustomerUseController.handle);

customerRoutes.post("/confirm", confirmCustomerUseController.handle);

customerRoutes.post(
  "/resend-confirmation-code",
  confirmCustomerSendCodeUseController.handle,
);

customerRoutes.post("/login", customerLoginUseController.handle);

customerRoutes.post("/forgot-password", forgotPasswordUseController.handle);

customerRoutes.post("/reset-password", resetPasswordUseController.handle);

export { customerRoutes };
