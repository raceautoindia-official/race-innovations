import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { convert } from "html-to-text";


const sesClient = new SESClient({
  region: process.env.AWS_S3_REGION,
  credentials: {
    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
  },
});

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
}) {
  const source =
    from ||
    process.env.NOREPLY_FROM ||
    "Race Innovations <no-reply@raceinnovations.in>";
  const plainText = text || convert(html || "", { wordwrap: 130 });

  const params = {
    Source: source,
    Destination: { ToAddresses: Array.isArray(to) ? to : [to] },
    Message: {
      Subject: { Data: subject, Charset: "UTF-8" },
      Body: {
        Html: { Data: html || "", Charset: "UTF-8" },
        Text: { Data: plainText, Charset: "UTF-8" },
      },
    },
    ReplyToAddresses: replyTo
      ? Array.isArray(replyTo)
        ? replyTo
        : [replyTo]
      : undefined,
  };

  return sesClient.send(new SendEmailCommand(params));
}

export async function sendBulkEmails(recipients, subject, message) {
  const results = [];
  let count = 0;

  const plainTextMessage = convert(message, { wordwrap: 130 });

  for (const recipient of recipients) {
    count++;
    console.log("Sending count:", count);

    const params = {
      Source: `"Race Innovations" <${process.env.SENDER_EMAIL}>`,
      Destination: {
        ToAddresses: [recipient],
      },
      Message: {
        Subject: { Data: subject },
        Body: {
          Html: {
            Data: message,
            Charset: "UTF-8",
          },
          Text: {
            Data: plainTextMessage,
            Charset: "UTF-8",
          },
        },
      },
      ConfigurationSetName:'EmailTrackingSet',
      ReplyToAddresses: [process.env.SENDER_EMAIL],
      Headers: {
        'List-Unsubscribe': `<mailto:info@raceautoindia.com>`,
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await sesClient.send(command);
      results.push({ success: result });
    } catch (err) {
      results.push({ error: err });
    }
  }

  console.log("First result:", results[0]);
  return results;
}
