import { mailtrapClient, sender } from "./mailtrap.config.js";
import { PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE, VERIFICATION_EMAIL_TEMPLATE } from "./emailTemplates.js";
import { response } from "express";

export const sendVerificationEmail = async (email, verificationToken) => {
	const recipients = [{ email }];

	try {
		const response = await mailtrapClient.send({
			from: sender,
			to: recipients,
			subject: "Verify your email",
			html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
			category: "Email Verification"
		});

		console.log("Email sent successfully:", response);
		return response;
	} catch (error) {
		console.error("Error sending verification email:", error.response?.data || error.message);
		throw new Error(`Error sending verification email: ${error.response?.data || error.message}`);
  };
};

export const sendWelcomeEmail = async (email, name) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      template_uuid: "0770a31b-6e14-4b34-bcb7-64d440e1efeb",
      template_variables: {
        name: name,
      },
    });
    console.log("Welcome email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending welcome email:", error.response?.data || error.message);
    throw new Error(`Error sending welcome email: ${error.response?.data || error.message}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipients = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Password reset email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset email:", error.response?.data || error.message);
    throw new Error(`Error sending password reset email: ${error.response?.data || error.message}`);
  }
}

export const sendResetSuccessEmail = async (email) => {
  const recipients = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipients,
      subject: "Your password has been reset",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Password Reset Success",
    });
    console.log("Password reset success email sent successfully:", response);
    return response;
  } catch (error) {
    console.error("Error sending password reset success email:", error.response?.data || error.message);
    throw new Error(`Error sending password reset success email: ${error.response?.data || error.message}`);
  }
}