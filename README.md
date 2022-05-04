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
GCLOUD_BUCKET=hanas
GCLOUD_PROJECT=concrete-welder-346410
GCLOUD_CLIENT_EMAIL=hanas-cloud-storage@concrete-welder-346410.iam.gserviceaccount.com
GCLOUD_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCST1GnIubFlsDX\ne6OzVOt8hmTZarS69pv1QU/LXYyOxSgcuabRd8xAYzoVrLR3crA+WJlcOiecTbCv\n4Z9pN0VqXZ/aPIJxeqLAgf0k5qy9/QJ4kXGP0n+ewz5R18XZFVB80RGvfdseZdDE\n94jnlqM1S9YMpztMoAB0lYIZVig4yMIZ2iHhZQxxN47mm4qZPTXslSnN2buS585o\n6fCW+UcYmC6GfrOM1d3jXQbLtwKGMILXH51iOdno6wV26Tv7t4fZmxG+4t3up/K7\nTFOE+Kk1aB398ieCShrSTG4C+NX6wTge/TWZbjGOkj2Wzo/U2ZxHpehiQzvKxElf\nCCO9d3e1AgMBAAECggEADoP8D97wkk3gmABWP2Z/bn1O6BskDyCEXJK8PersFQYO\ncrsgh8ug4gp2KsxVozwnrCfSH0pNv74dd3WlASVQp7reLyKttmB6YSsEWHLiVH8T\nja6wW5qAutmYBzqnEGCC+b8sSALuiFeFnOUKGh/h1VnOxLaatYFySh7DJ4xatTdf\nTh+h5iMbezqmcTwYNisHRKhjHUKxx5XfI7gWCD3PB3OOiRebe8OxWa3wt6jJLnVu\nfon+Blj0d7OekcH7ZJ5S1uj5DeiatRX+pQ9nhvJEt9NCWd8KzP8sGE7vOizuF1Pp\nLkD1aKRtM+w8WAnTkijDgw00+nyN5eLA+9MZGAjsQQKBgQDIFuaJY9Exycetf+dj\nL4hvuVIWZICeZGRvyS+bJmvbpEPZNN2EJPQrDTA6kpwwD0FcMjCUqGCm8nzcN+ju\nD98SOPKacSu1urtworlxt6gNNX3uh6WuOzoNCpooVH5nh1JskBlfuomHlGWW6ERS\neJhxZIF+yR3dwaF4g/eLulMajQKBgQC7MV/KWF7LhZJOEuXdJWKqVj0FfM4+35/Y\nxgdHBDSfxS1vCv1fdwh52ZbF3Eiyhhuaty7z7IWKL6ysid2wpNQmXI0QbYq4edJg\nHYhixcNuy92AIZfOZj8t2Yfs+JIzsm3AXrFLX7n9gw4qkaJFtTkmAynEFprrISCn\nzoqInMXbyQKBgGF49nl7jM9KUuGsa1YgM8DpcJnD//wpP9xND8nvH5/yF7NaU4cq\nUWAfnp0KCthGtjppoMzqcZsiibzl560BQlQoNdcSxo5TFzi5rMk/BLjalCx9HDMS\nWyc7QPngn2tjur10PUgrIRBRNGQdZhse8HRc19ChvNDooPaKoy8IZ6+JAoGBAKXi\nik3JZDAdbVrMunDweXATvj3HrQngqEm0q6xOWMghNzMJXSGlXZiFr2wl2zKBT6Ma\npHw65NhhiTbZceDhILPiHowpVt5F7p2Ibl2BfcAI34B1xI5+44whEqh4Wy9+9m2c\nPKdb7HlxEzO8HT6C62L5OKDxm1W05Lhweym3LEupAoGALAmYQmmx//C2DRrokijY\nnTZ2v6zawfS0d89JJmk3/p5TQKqaLSTjzsIp0K+RbNbnKHxTDcYFA3oVb6M0qiaH\nTh18Sa99DwIIDHzVTq+69V6AdMbr3IakbnyynsncwTOtl0y7XSreNMKj7fsf3HLT\n8ztq2zNH7yTvhWU2l63U/G0=\n-----END PRIVATE KEY-----\n"
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

