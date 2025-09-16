import consola from "consola"
import { SMTPServer } from "smtp-server"
import {simpleParser} from 'mailparser'

export default defineNitroPlugin(() => {
  const server = new SMTPServer({
    secure: false,
    authOptional: true,

     onData(stream, session, callback) {
       simpleParser(stream)
      .then(mail => {
        // Now you have a clean, parsed email object.
        consola.success('Email received and parsed successfully!');
        consola.log('Subject:', mail?.subject);
        consola.log('From:', mail?.from?.text);
        consola.log('To:', mail?.to?.text);
        consola.log('Body (text):', mail.text);
        
        // Handle HTML body if it exists
        if (mail.html) {
          consola.log('Body (HTML):', mail.html);
        }

        // Handle attachments
        if (mail.attachments.length > 0) {
          consola.log(`Attachments found: ${mail.attachments.length}`);
          mail.attachments.forEach(attachment => {
            consola.log(`- Filename: ${attachment.filename}, Type: ${attachment.contentType}`);
          });
        }
        
        // Signal to the client that the message was accepted
        callback(null);
      })
      .catch(err => {
        // Handle any parsing errors
        consola.error('Error parsing email:', err);
        callback(new Error('Failed to process email'));
      });
     
     }
  })

  server.listen(3001, () => {
    consola.info('SMTP Server listening on port 3001')
  });

 
})