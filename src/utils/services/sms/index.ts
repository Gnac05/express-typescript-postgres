import config from '@config';
import { logger } from '@utils/logger';
import twilio, { Twilio } from 'twilio';

/**
 * I am a singleton class that provides SMS related functionalities.
 *
 * I am a singleton class because I need to be instantiated only once.
 *
 * I use Twilio to send SMS messages.
 *
 * @example
 * import SmsUtils from '@utils/services/sms';
 *
 * SmsUtils.sendSms('+1234567890', 'Hello World!');
 */
export class SmsUtils {
  /** The singleton SmsUtils instance */
  private static instance: SmsUtils;
  /** The Twilio client */
  private twilioClient: Twilio;

  private constructor() {
    this.twilioClient = twilio(config.sms.twilio.accountSid, config.sms.twilio.authToken);
  }

  /**
   * Get the SmsUtils singleton instance.
   * @returns SmsUtils
   * @example
   * const smsUtils = SmsUtils.getInstance();
   * smsUtils.sendSms('+1234567890', 'Hello World!');
   *
   * // Or
   *
   * SmsUtils.getInstance().sendSms('+1234567890', 'Hello World!');
   */
  public static getInstance(): SmsUtils {
    if (!SmsUtils.instance) {
      SmsUtils.instance = new SmsUtils();
    }
    return SmsUtils.instance;
  }

  /**
   * Send an SMS message.
   * @param to The phone number to send the SMS message to.
   * @param body The body of the SMS message.
   * @returns void
   */
  public async sendSms(to: string, body: string): Promise<void> {
    try {
      await this.twilioClient.messages.create({
        body,
        from: config.sms.twilio.phoneNumber,
        to,
      });
      logger.info('SMS message sent successfully.');
    } catch (error) {
      logger.error('Error sending SMS message:', error);
    }
  }
}

export default SmsUtils.getInstance();
