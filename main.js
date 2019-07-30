const querystring = require('querystring');
const sgMail = require('@sendgrid/mail');
const templates = querystring.parse(process.env.TEMPLATE_QUERY_STRING);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Sendmail Worker Function
 *
 * @param {object} data The event payload.
 * @param {object} context The event metadata.
 */
exports.sendMailReceived = (data, context) => {
    const pubSubMessage = data;
    const payload = Buffer.from(pubSubMessage.data, 'base64').toString();
    const json = JSON.parse(payload);

    /**
     * Expected request object
     * {
     *   from_address: '',
     *   from_name: '',
     *   to_address: 'email@example.com',
     *   to_name: 'John Doe',
     *   template: 'recovery|welcome|verify',
     *   subject: '',
     *   text: '',
     *   html: '',
     *   replyTo: '',
     *   attachments: [
     *     {
     *       content: 'Some base 64 encoded attachment content',
     *       filename: 'some-attachment.txt',
     *       type: 'plain/text',
     *       disposition: 'attachment',
     *       content_id: 'mytext'
     *     },
     *     ...
     *   ],
     *   template_payload: {
     *     ...
     *   },
     *   headers: {
     *     ...
     *   }
     * }
     */

    // Check if dest address is empty
    if(!json.to_address) {
        console.log("Unable to complete request: destination email unspecified");
        return;
    }

    // Assign default from address if not specified
    if(!json.from_address) {
        json.from_address = process.env.DEFAULT_FROM_ADDRESS;
        json.from_name = process.env.DEFAULT_FROM_NAME;
    }

    // Create sendgrid payload
    let send = {
        to: (json.to_name) ? `${json.to_name} <${json.to_address}>` : json.to_address,
        from: (json.from_name) ? `${json.from_name} <${json.from_address}>` : json.from_address,
        subject: json.subject,
        text: json.text,
        html: json.html,
        attachments: json.attachments,
        headers: json.headers,
        replyTo: json.replyTo,
        cc: json.cc,
        bcc: json.bcc
    };

    // Add template parameters, if exists
    if(json.template) {
        if(templates[json.template]) {
            // Template known, append
            send.templateId = templates[json.template];
            send.dynamic_template_data = json.template_payload
        }
    }

    // Send mail
    sgMail.send(send)
        .then(() => console.log('Mail sent successfully'))
        .catch(error => console.error(error.toString()));

    console.log("Sendmail request received");
};