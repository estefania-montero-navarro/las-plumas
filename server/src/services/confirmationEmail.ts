import sgMail from "@sendgrid/mail";

export class ConfirmationEmailService {
  // Send confirmation email
  public async sendConfirmationEmail(email: string, subject: string, body: string) {
    try {
      sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

      const message = {
        // parameters passed
        to: email,
        from: "ingebasespi24@gmail.com",
        subject: subject,
        text: body,
        html: `<strong>${body}</strong>`,


      };
      
      await sgMail.send(message);
      console.log("Email sent successfully");

      return true; // Email sent successfully

    } catch (error) {
      console.error("Error sending confirmation email:", error);
      throw error; // Handle error accordingly
    }
  }
}
