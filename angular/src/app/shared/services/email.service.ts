// Configurations
import { environment } from 'src/environments/environment';

// Angular
import { Injectable } from '@angular/core';

// Libaries
// import { SMTPClient } from 'emailjs';


@Injectable({
  providedIn: 'root'
})

export class EmailService {
/*
  private _smtpClient = new SMTPClient({
    user: environment.email.username,
    password: environment.email.pw,
    host: environment.email.host,
    tls: true,
  })

  async sendEmail(to: string,
                  subject: string,
                  text: string): Promise<Boolean> {
    const reg_message: any = {
      text: 'i hope this works',
      from: environment.email.from,
      to: 'bruno_churchi@gmx.ch',
      cc: '',
      subject: 'testing emailjs',
    };

    await this._smtpClient.sendAsync(reg_message)
      .then((res: any) => {
console.log(res);
      })

    return new Promise((resolve) => {
      resolve(true);
    });
  }
*/

}
