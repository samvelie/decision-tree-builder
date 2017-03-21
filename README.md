Building a decision tree builder.

OAuth framework from Luke Schlangen's nodeFire.

## Deploying
This is incredibly tedious the first time, but will automatically deploy your application with every future change. In order to deploy this project publicly, you will likely need to add your service account properties as environment variables. Here is how to do that with Heroku:

1. Convert `firebase-service-account` to `.env` variables
  1. Add `dotenv` to you project through `npm install --save dotenv`.
  2. Add a `.env` file to the root folder of your project. Copy this text into that file (note that there are no commas):

      ```
      FIREBASE_SERVICE_ACCOUNT_TYPE="XXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PROJECT_ID="XXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID="XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
      FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nA Whole lot of XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL="XXXXXXXXXXXXXXXX@XXXXXXXXX.iam.gserviceaccount.com"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_ID="##################"
      FIREBASE_SERVICE_ACCOUNT_AUTH_URI="https://accounts.google.com/o/oauth2/auth"
      FIREBASE_SERVICE_ACCOUNT_TOKEN_URI="https://accounts.google.com/o/oauth2/token"
      FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL="https://www.googleapis.com/oauth2/v1/certs"
      FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL="https://www.googleapis.com/XXXXXXXXXXX.iam.gserviceaccount.com"
      ```

      Replace every value from the right hand side of the equal sign inside of quotes in the `.env` file with the corresponding secret key from your `firebase-service-account.json` file:

      ```
      {
        "type": "XXXXXXXXX",
        "project_id": "XXXXXXXXX",
        "private_key_id": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        "private_key": "-----BEGIN PRIVATE KEY-----\nA Whole lot of XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX\n-----END PRIVATE KEY-----\n",
        "client_email": "XXXXXXXXXXXXXXXX@XXXXXXXXX.iam.gserviceaccount.com",
        "client_id": "##################",
        "auth_uri": "https://accounts.google.com/o/oauth2/auth",
        "token_uri": "https://accounts.google.com/o/oauth2/token",
        "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
        "client_x509_cert_url": "https://www.googleapis.com/XXXXXXXXXXX.iam.gserviceaccount.com"
      }
      ```

  3. Navigate to `server/modules/decoder.js`. Replace the reference to your `firebase-service-account.json` with an object that refers to all of your `.env` variables.

    ```javascript
    admin.initializeApp({
      credential: admin.credential.cert("./server/firebase-service-account.json"),
      databaseURL: "https://my-firebase-app.firebaseio.com" // you replaced this line earlier
    });
    ```

    Now becomes

    ```javascript
    admin.initializeApp({
      credential: admin.credential.cert({
        "type": process.env.FIREBASE_SERVICE_ACCOUNT_TYPE,
        "project_id": process.env.FIREBASE_SERVICE_ACCOUNT_PROJECT_ID,
        "private_key_id": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY_ID,
        "private_key": process.env.FIREBASE_SERVICE_ACCOUNT_PRIVATE_KEY,
        "client_email": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_EMAIL,
        "client_id": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_ID,
        "auth_uri": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_URI,
        "token_uri": process.env.FIREBASE_SERVICE_ACCOUNT_TOKEN_URI,
        "auth_provider_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_AUTH_PROVIDER_X509_CERT_URL,
        "client_x509_cert_url": process.env.FIREBASE_SERVICE_ACCOUNT_CLIENT_X509_CERT_URL
      }),
      databaseURL: "https://my-firebase-app.firebaseio.com"
    });
    ```
    4. In the `server/app.js` file, add `require('dotenv').config();` near the top of the file (as the first line is ideal)
    

2. Deploy to Heroku
  1. Create an [Heroku](https://www.heroku.com/) account.
  2. Create a new Heroku Application.
  3. Under the `Settings` tab, in the `Config Variables` section, select `Reveal Config Vars`. Here you will need to add every configuration variable to the list (everything on the left side of the equals sign in your `.env` file is the key, everything on the right side is the value)
  4. Under the `Deploy` tab, in the `Deployment Method` section, select `Github`. Connect to the Github repository with your application.
  5. In the `Manual Deploy` section, click `Deploy Branch` to deploy for the first time.

3. Update firebase to allow another domain
  1. Return to the [firebase console](https://console.firebase.google.com/project/_/authentication/providers) and select your current project.
  2. If the link from the step above doesn't navigate you there automatically, navigate to authentication in the left hand navigation and select `SIGN-IN MMETHOD`
  3. Scroll down to the `OAuth redirect domains` section and click the `ADD DOMAIN` button
  4. Add the new domain that your site is being hosted on, likely something like `https://rushing-waterfall.herokuapp.com/`
