![Typescript](https://assets.jeanlescure.io/f8mvuN.svg)
![plus](https://assets.jeanlescure.io/gxaoy.svg)
![AWS Lambda](https://assets.jeanlescure.io/xO8TmJzK.svg)

# No BS Typescript Lambda Boilerplate

This boilerplate focuses on keeping configuration to a minimum yet supporting all latest Typescript
features for making it as easy and worry-free as possible to get started building a performance
optimized [AWS Lambda](https://aws.amazon.com/lambda/) Function.

This project is open to updates by its users, I ensure that PRs are relevant to the community.
In other words, if you find a bug or want a new feature, please help us by becoming one of the
[contributors](#contributors-) ✌️ ! See the [contributing section](#contributing).

:rotating_light: **Before continuing:**

- If you're creating an API using Express.js consider looking at my [No BS Typescript Server Boilerplate]()
- If you're creating a Javascript/Typescript module consider looking at my [No BS Typescript Boilerplate]()
- If you're creating a React.js app consider looking at my [No BS React Boilerplate]()

## Like this project? :heart:

Please consider:

- [Buying me a coffee](https://www.buymeacoffee.com/jeanlescure) :coffee:
- Supporting me on [Patreon](https://www.patreon.com/jeanlescure) :trophy:
- Starring this repo on [Github](https://github.com/jeanlescure/string-crypto) :star2:

## How to get started using this boilerplate

The logic of this repo is structured in such a way that all you need to worry about is placing your
code in the `src` directory (using `src/index.ts` as entry point).

## Development and build scripts

I chose Rollup to handle the transpiling, compression, and any other transformations needed to get
your Typescript code running as quickly and performant as possible.

**Development**

```
yarn dev
```

**NOTE:** This command depends on you having Docker installed in your development environment.

When run, this script will build your lambda and run a docker container with the image [lambci/lambda](https://hub.docker.com/r/lambci/lambda)
which is a sandboxed local environment that replicates the live AWS Lambda environment almost identically.

It also uses `nodemon` to rebuild and restart the docker container automagically whenever you
edit your typescript code, a.k.a. hot reload :fire:

Once running you can test your lambda by invoking it using `aws-cli`:

```
aws lambda invoke \
  --endpoint http://localhost:9001 \
  --no-sign-request \
  --function-name myfunction \
  --payload '{}' \
  output.json
```

**IMPORTANT:** If you are using AWS CLI v2 you must add the `--cli-binary-format raw-in-base64-out`
argument and value, as such:

```
aws lambda invoke \
  --endpoint http://localhost:9001 \
  --no-sign-request \
  --cli-binary-format raw-in-base64-out \
  --function-name myfunction \
  --payload '{}' \
  output.json
```

I have also provided a mock payload (`mock-payload.json`) that mimics an event sent by API Gateway,
which you can use by replacing the value of the `--payload` argument with a `file://` definition:

```
aws lambda invoke \
  --endpoint http://localhost:9001 \
  --no-sign-request \
  --cli-binary-format raw-in-base64-out \
  --function-name myfunction \
  --payload file://mock-payload.json \
  output.json
```

Finally, you can also test your function using an HTTP request with Postman, Insomnia, or even Curl, like so:

```
curl -d '{}' http://localhost:9001/2015-03-31/functions/myfunction/invocations
```

**Build**

```
yarn build
```

This command will build the `dist/index.js` bundle of your code (uglified and tree-shaken so it
loads/runs faster), it installs the node modules specified under the `"dependencies"` section
in the `package.json` (no `"devDependencies"`), and finally packages it all into a `function.zip`
file that you can upload to your aws account using the following commands:

```sh
# Create function
LAMBDA_NAME=myNoBSLambda

LAMBDA_ROLE_ARN=$(aws iam create-role \
  --role-name $LAMBDA_NAME \
  --assume-role-policy-document '{"Version": "2012-10-17","Statement": [{ "Effect": "Allow", "Principal": {"Service": "lambda.amazonaws.com"}, "Action": "sts:AssumeRole"}]}' \
  --query "Role.Arn" --output=text) \
&& sleep 15 \
&& aws iam attach-role-policy \
  --role-name $LAMBDA_NAME \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole \
&& sleep 15 \
&& aws lambda create-function \
  --function-name $LAMBDA_NAME \
  --handler index.handler \
  --runtime nodejs12.x \
  --role $LAMBDA_ROLE_ARN \
  --zip-file fileb://dist/function.zip

# Update function
aws lambda update-function-code --function-name $LAMBDA_NAME --zip-file fileb://dist/function.zip
```

## Contributing

Yes, thank you! This plugin is community-driven, most of its features are from different authors.
Please update the docs and tests and add your name to the `package.json` file.

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):
