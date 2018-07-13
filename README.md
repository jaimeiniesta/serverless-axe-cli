# Serverless-Axe-Cli

AWS Lambda function to check a11y using axe-cli.

## Introduction

This repo contains an example of a AWS Lambda functions that accepts an URL and
checks its A11Y using axe-core 2.5.0 with phantomjs, through axe-cli.

## See it in action

https://7t4at0aif2.execute-api.eu-central-1.amazonaws.com/dev/a11y-check?url=http://example.com

## Deploy

The simplest way to deploy this is using the [Serverless framework](https://serverless.com/).

Once installed, just deploy it with `serverless deploy -v` and check the logs after that with `serverless logs -f a11yCheck -t`.

## Limitations

The function is fired after an API Gateway HTTP endpoint request is made. This imposes a timeout of 30 seconds, and there are cases where the axe-core check could take longer.

To work around this, a better approach is firing the function by sending a message to a SNS topic, containing the URL to validate and the callback URL to post the results to. This is not included in the current repo.
