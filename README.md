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
NODE_ENV = development
PORT = 8000
MONGO_URI = mongodb+srv://Hanas:Hanas1234@hanascluster.cw7en.mongodb.net/Hanas?retryWrites=true&w=majority
MY_SECRET_ACCESS_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9_eyJzdWIiOiI2OTY5NjkiLCJuYW1lIjoiU295IEd3YXBvIiwiaWF0IjoxNTE2MjM5MDIyfQ_MxYPoabA4HNaaswJSl993lUwhVYOjfs3-G6BEm6Ufe8
TWILIO_ACCOUNT_SID=AC16b9ab8c719a64a2c95d7ce74da913e9
TWILIO_ACCOUNT_TOKEN=3614c210aac66df116a1adbaa97b1e4d
TWILIO_MESSAGING_SERVICE_SID=MG143a7c3a65466fbb2e7984883e00029b
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

