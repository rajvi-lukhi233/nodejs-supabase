const express = require("express");
const app = express();
const indexRoute = require("./routes/index");

const port = process.env.PORT;

app.use(express.json());

app.use("/api", indexRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
