import config from '@config';
import { logger } from '@utils/logger';
import twilio, { Twilio } from 'twilio';

class SmsUtils {
  private static instance: SmsUtils;
  private twilioClient: Twilio;

  private constructor() {
    this.twilioClient = twilio(config.sms.twilio.accountSid, config.sms.twilio.authToken);
  }

  public static getInstance(): SmsUtils {
    if (!SmsUtils.instance) {
      SmsUtils.instance = new SmsUtils();
    }
    return SmsUtils.instance;
  }

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
