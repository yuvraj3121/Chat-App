import connectDB from "./dataBase/index.dataBase.js";
import dotenv from "dotenv";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 3000, () => {
      console.log(`listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log("mongoDB connection fail !!", err);
  });
