import dotenv from "dotenv";
import services from "./data/services.js";
import Services from "./models/serviceModel.js";
import connectDB from "./config/db.js";

dotenv.config();

await connectDB();

const importData = async () => {
  try {
    await Services.deleteMany();

    await Services.insertMany(services);

    console.log("Data Imported!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await Services.deleteMany();

    console.log("Data Destroyed!");
    process.exit();
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
