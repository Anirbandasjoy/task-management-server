const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const PORT = process.env.PORT || 4000;

app.use(cors());

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
