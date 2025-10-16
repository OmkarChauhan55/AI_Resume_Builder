import { config } from "dotenv";
config(); // <- Only once at the very top

import app from "./app.js";
import { connectDB } from "./db/index.js";

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log("Server is running on http://localhost:" + process.env.PORT);
  });
});
