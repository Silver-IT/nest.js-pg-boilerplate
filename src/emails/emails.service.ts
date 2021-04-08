import { Injectable } from '@nestjs/common';
import * as sgMail from '@sendgrid/mail';

import {
  EmailVerificationModel,
  ForgotPasswordModel,
} from '../common/models/emails.model';
import { resetPasswordLinkExpireHours } from '../common/constants/general.constants';

@Injectable()
export class EmailsService {
  private readonly HOST_URL: string;

  constructor() {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    this.HOST_URL =
      process.env.NODE_ENV === 'staging'
        ? process.env.STAGING_HOST
        : process.env.NODE_ENV === 'production'
        ? process.env.PRODUCTION_HOST
        : process.env.DEVELOPMENT_HOST;
  }

  async sendTestEmail(email: string): Promise<boolean> {
    console.log('Sending Email will be handled later.');

    if (true) {
      return new Promise((resolve) => resolve(true));
    }

    const msg = {
      to: email,
      from: 'no-reply@learning-xl.com',
      subject: 'Sending with Twilio SendGrid is Fun',
      text: 'and easy to do anywhere, even with Node.js',
      html: '<strong>and easy to do anywhere, even with Node.js</strong>',
    };
    try {
      await sgMail.send(msg);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async sendForgotPasswordEmail(
    fpModel: ForgotPasswordModel,
  ): Promise<boolean> {
    console.log('Sending Email will be handled later.');

    if (true) {
      return new Promise((resolve) => resolve(true));
    }

    const resetPasswordLink = `${this.HOST_URL}/auth/reset-password?token=${fpModel.token}`;

    const msg = {
      to: fpModel.email,
      from: 'no-reply@learning-xl.com',
      templateId: process.env.SENDGRID_TEMPLATE_RESET_PASSWORD,
      dynamic_template_data: {
        username: fpModel.username,
        reset_password_link: resetPasswordLink,
        hours_to_be_expired: resetPasswordLinkExpireHours,
      },
    };

    return new Promise((resolve) => {
      sgMail
        .send(msg)
        .then((result) => {
          console.log(result);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          resolve(false);
        });
    });
  }

  async sendValidationEmail(evModel: EmailVerificationModel): Promise<boolean> {
    console.log('Sending Email will be handled later.');

    if (true) {
      return new Promise((resolve) => resolve(true));
    }

    const validationLink = `${this.HOST_URL}/auth/validate-email?token=${evModel.id}`;

    const msg = {
      to: evModel.email,
      from: 'no-reply@learning-xl.com',
      templateId: process.env.SENDGRID_TEMPLATE_EMAIL_VALIDATION,
      dynamic_template_data: {
        validate_email_link: validationLink,
      },
    };

    return new Promise((resolve) => {
      sgMail
        .send(msg)
        .then((result) => {
          console.log(result);
          resolve(true);
        })
        .catch((error) => {
          console.log(error);
          resolve(false);
        });
    });
  }
}
