import config from '@config';
import { logger } from '@utils/logger';
import nodemailer, { Transporter } from 'nodemailer';

class EmailUtils {
  private static instance: EmailUtils;
  private transporter: Transporter;

  private constructor() {
    this.transporter = nodemailer.createTransport(config.email.smtp);

    /* istanbul ignore next */
    if (config.env !== 'test') {
      this.transporter
        .verify()
        .then(() => logger.info('🟢 Connected to email server'))
        .catch(() => logger.warn('🔴 Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
    }
  }

  public static getInstance(): EmailUtils {
    if (!EmailUtils.instance) {
      EmailUtils.instance = new EmailUtils();
    }
    return EmailUtils.instance;
  }

  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = { from: config.email.from, to, subject, text };
    await this.transporter.sendMail(msg);
  }

  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }

  public async sendVerificationEmail(to: string, token: string): Promise<void> {
    const subject = 'Email Verification';
    // replace this url with the link to the email verification page of your front-end app
    const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
    const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }
}

export default EmailUtils.getInstance();