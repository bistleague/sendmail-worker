# sendmail-worker
BIST League backend sendmail worker

### Environment Variables
```dotenv
SENDGRID_API_KEY=<sendgrid_api_key>
TEMPLATE_QUERY_STRING=<e.g. template1=template_id&template2=template_id>
DEFAULT_FROM_ADDRESS=<default from address, e.g. noreply@bistleague.com>
DEFAULT_FROM_NAME=<default from name, e.g. BIST League 2.0>
```

### Deployment to Cloud Functions
```
gcloud functions deploy sendmail-beta --runtime nodejs10 --entry-point sendMailReceived --env-vars-file .env.yaml --trigger-topic sendmail
```