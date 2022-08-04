const app = require("./app");

const dotenv = require("dotenv");

const connectDatabase = require("./config/database")

process.on("uncaughtException", (err)=>{
       console.log(`error : ${err.message}`);
       console.log("shutting down the server due to  unCaught exeption");
       process.exit(1);
})

dotenv.config({path:"backend/config/config.env"})

connectDatabase();


const server = app.listen(process.env.PORT, ()=>{
      
        console.log(`listening on port no ${process.env.PORT}`)
})

process.on("unhandledRejection",(err)=>{
       console.log(`error : ${err.message}`);
       console.log("shutting down the server due to  unhandled promise Rejection");

       server.close(()=>{
              process.exit(1);
       })
})