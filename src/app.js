const express = require("express");
const app = express();
const indexRoute = require("./routes/index");
const path = require("path");

const port = process.env.PORT || 5000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/api", indexRoute);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
