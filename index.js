require('dotenv').config();
const dirname = require('path');
const fileUrl = require('url');
const express = require('express');
const exphbs = require('express-handlebars');
const indexRouter = require('./src/routes/indexRouter.js').reglogTest;


const mongoose = require('mongoose');


function connectToDB(dbName = process.env.DB_NAME) {
    return mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("MongoDB connection successful");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });
}

function closeDB(){
    console.log("Closing MongoDB connection...");
    mongoose.disconnect();
    process.exit();
}

process.on("SIGINT", closeDB);
process.on("SIGTERM", closeDB);
process.on("SIGQUIT", closeDB);


//app startup
async function main () {
    const app = express();

    app.use("/static", express.static(__dirname + "/public"));

    app.use(express.static('./public'));

    app.engine('hbs', exphbs.engine({extname: 'hbs',
                                        defaultLayout: false}));
    app.set('view engine', 'hbs');
    app.set("views", "./views");
    app.set("view cache", false);

    // from this point onwards, we are going to receive json format data
    app.use(express.json());

    app.use(indexRouter);

    try {
        // Connect to MongoDB
        await connectToDB();
        console.log ('Connected to MongoDB.');
        // Start Express App
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log("Express app now listening...");
        });
    } catch (err) {
        console.error(err);
        process.exit();
    }

}

main();