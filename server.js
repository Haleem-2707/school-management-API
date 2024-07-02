require("dotenv").config();
const http = require("http");
const app = require("./app/app");
require("./config/dbconnect");


const PORT = process.env.PORT || 2024;




//Server
const server = http.createServer(app);
server.listen(PORT, console.log(`Server is running on port ${PORT}`));

