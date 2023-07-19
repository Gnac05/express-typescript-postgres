import config from '@config';
import { logger } from '@utils/logger';
import nodemailer, { Transporter } from 'nodemailer';

/**
 * I am a singleton class because I need to be instantiated only once.
 *
 * I use Nodemailer to send emails.
 *
 * @example
 *
 * import emailUtils from '@utils/services/email';
 *
 * emailUtils.sendEmail('to@mail.com', 'Hello World!', 'Hello World!');
 */
export class EmailUtils {
  /** The singleton EmailUtils instance */
  private static instance: EmailUtils;
  /** The Nodemailer transporter */
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

  /**
   * Get the EmailUtils singleton instance.
   *
   * @returns EmailUtils
   */
  public static getInstance(): EmailUtils {
    if (!EmailUtils.instance) {
      EmailUtils.instance = new EmailUtils();
    }
    return EmailUtils.instance;
  }

  /**
   * Send an email.
   *
   * @param to The email address to send the email to.
   * @param subject The subject of the email.
   * @param text The text of the email.
   * @returns void
   * @example
   *
   * import emailUtils from '@utils/services/email';
   *
   * emailUtils.sendEmail('to@mail.com', 'Hello World!', 'Hello World!');
   * */
  public async sendEmail(to: string, subject: string, text: string): Promise<void> {
    const msg = { from: config.email.from, to, subject, text };
    await this.transporter.sendMail(msg);
  }

  /**
   * Send a password reset email.
   *
   * @param to The email address to send the email to.
   * @param token The password reset token.
   * @returns void
   * @example
   *
   * import emailUtils from '@utils/services/email';
   *
   * emailUtils.sendResetPasswordEmail('to@mail.com', 'token');
   * */
  public async sendResetPasswordEmail(to: string, token: string): Promise<void> {
    const subject = 'Reset password';
    // replace this url with the link to the reset password page of your front-end app
    const resetPasswordUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
    await this.sendEmail(to, subject, text);
  }

  /**
   * Send an email verification email.
   *
   * @param to The email address to send the email to.
   * @param token The email verification token.
   * @returns void
   * @example
   *
   * import emailUtils from '@utils/services/email';
   *
   * emailUtils.sendVerificationEmail('to@mail.com', 'token');
   */
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
