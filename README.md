# HANAS BE - Setup Enviroment(Quick Guide)

### 1. Clone repository in your local

```
git clone https://github.com/TaiyoShiawase/Hanas-BE.git
```

### 2. Install the packages being used in this project

```
npm install --save
```

Initial Packages Installed:

- nodemon
- express
- express-async-handler
- express-validator
- mongoose
- dotenv
- bcrypt
- uuid

### 3. Create .env file and add the following:

```
NODE_ENV=development
PORT=8000
MONGO_URI=mongodb+srv://Hanas:Hanas1234@hanascluster.cw7en.mongodb.net/Hanas?retryWrites=true&w=majority
MY_SECRET_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_eyJzdWIiOiI2OTY5NjkiLCJuYW1lIjoiU295IEd3YXBvIiwiaWF0IjoxNTE2MjM5MDIyfQ_MxYPoabA4HNaaswJSl993lUwhVYOjfs3-G6BEm6Ufe8
TWILIO_ACCOUNT_SID=AC16b9ab8c719a64a2c95d7ce74da913e9
TWILIO_ACCOUNT_TOKEN=3614c210aac66df116a1adbaa97b1e4d
TWILIO_MESSAGING_SERVICE_SID=MG143a7c3a65466fbb2e7984883e00029b
NODE_EMAILER_PASS=byjmhxkjtvanpcjx
GCLOUD_BUCKET=hanas-storage
GCLOUD_PROJECT=principal-storm-344808
GCLOUD_CLIENT_EMAIL=hanas-531@principal-storm-344808.iam.gserviceaccount.com
GCLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQDirZNCYRWMkZYG\nn5xX3DSSXMOuAIgSocwlc1o0MGk+PfXgdfe4nd39RIVSIGLekOaxI6buQxpm7udq\nF4QemuVWzH5RVIkFyGbUImcsLC7LB9tISaKsz9T8m6BUUs42Z5YcZili19Pmymqz\ncaggtqbz+jbx3iVBIltPOEo2DmorWSaebMf5ez5lBL385MkgZJeyh8byyd/LyBhM\nIxi0+SdOMvTyroE8E4NUTV7yYgY4Evu07X9KD+ipVx+mjH8lV0OkwkxTXZDtIrK8\nbzGRa/U4YKMNgUgFXQYHl5oAwi1n7V099nBmrWcDwsmRos6LjoiMcAcExy6LARvh\nkWA0ShaPAgMBAAECggEAGAiIPvb1JnC/I9ejZ2tZBZWhR58VzkfqUaQv0a26UteV\n7KUFTUUrprEvo3v8j5V0aB6cEdH6iCRXU9fHcclBfJj04aGhX4QWZvJ41uWeVndw\nR/NKtKDad6f2cUpQQ9NqxnsMc0bn2CXo9zqbNVC4VdDXJ4DCmWvPm5AfyihwGEVJ\n36gPvz+HAYAqQ+HphMRL9ZfbybiPZ2SVGN2PA8ts0ioC/8++imwveNBGRWuMG9IK\nN3RiyR8m10UhNiXGNvaLBORZjvQIZ4bjHLhfU3z7GDEUmrGbfGxfA8HuLciMhU5q\nntmmfr1aGoPa4Vl0N8M8yVTl0f8omEuy1NfaH1LkzQKBgQD8pXrMi765V7mkN9+I\ncrar9uurtHLKrYTHYY4ScX69+eSGZynhBfSBQuBgLkWkjrbQ4HxndWkpb2ptxoOO\nTIGyBxxPiaBmRYd1e0KNK68jL5/KixCgWf6Z1wAQ6nHaP/+LApfCIcXVPNGem6zu\n+muLzVxiRDLPGV7B+SlXM3iYHQKBgQDlr9omC0PHDeBlIRCfSIj/D4/lw4NOqvu7\nQ5szMspt1thwD+JXEquaVo0196RK168ZLrhyuIZA10xgHIfi/EkgPEdN2Uh5KfHC\nO8vDXmBOUOJqsL5Gg8AAkXPt+PEhjYr5vFO1Fs1FCgPsq8jB2HJq+f/fOaUPIQMT\nkvGIV79hmwKBgQD1j5XKyC0pkpWSgugWhID+pfIsoyhLzNnYvP5M+Nlap0+yPwVa\nfOJI3QqfEXqJVllkrjzchicfqfZFGoT1w3Dv669ds4Qew4fE7XgjJImG5pwmToJr\niO1I88tRpb3hhwDHSU7d1tulxgZsZh1w7h+n84PO00CbQKp0WMwQwKt/FQKBgQCJ\nKb/rkjSSjZ3gpqNHi8iMEN4NBvnGI+OajCAFriIm//NW0JWJDBRAYcmIXe/V5gGh\n1z28/Kbn1+q7Rq57hc+hmX23ZreZ68t9A7qGXDjE7BaaQhwO/iTN8g66ITzWnbFN\nvAJ9FTXWMcnwLxH/eOOzMMJ1qvYAF+W/bbQhiM04WwKBgQDleetOd2iyCPojfDoQ\nuPLvzo2s3nbwdtpK3w/aebzpfDpGEbGBosCHa8okFsiH4ldzjfsagB/dlxrncHYS\n1bXz/btiIxv5PSzvQD9i7fucGGr+kqJRiyA7sL6hQowtXoLsfwos9lq4yynN53oJ\ne6JIoBW9ZL9j+ZZ2/O36uGx5ow==\n-----END PRIVATE KEY-----\n"
```

### 4. Command to run server

```
npm run server
```

### 5. To test server, try to register an account using POSTMAN

```
http://localhost:8000/api/client/register
```

Sample:

> ![image](https://user-images.githubusercontent.com/51246035/153532232-aff988d7-6a76-465e-a274-4270b6bda7ee.png)

# Setup MongoDB Compass in your local machines and connect to Hanas database:

### 1. Install MongoDB Compass

_Link: https://www.mongodb.com/try/download/compass_

### 2. Open MongoDB Compass and connect to Hanas Database by using this connection string

```
mongodb+srv://Hanas:Hanas1234@hanascluster.cw7en.mongodb.net/Hanas
```

### 3. You should be able to see the list of DBs once successful

> ![image](https://user-images.githubusercontent.com/51246035/153533507-3ba17289-cf5e-4cc4-8229-e6fc9f36bff7.png)
