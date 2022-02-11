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
 
### 4. Command to run server

```
npm run server
```
### 5. To test server, try to register an account using POSTMAN

```
http://localhost:8000/api/client/register
```
Required inputs to pass validation:
 - firstname
 - middlename
 - lastname
 - email
 - password 
