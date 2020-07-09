const mongoose = require('mongoose');
mongoose.Promise = Promise;
exports.connect=function(){
    mongoose.connect(process.env.MONGODB, {useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true}, ()=>{
        console.log("Database Connected");
    });
    if(!(process.env.CORN))
    mongoose.set('debug', true);
    mongoose.connection.on('error', ()=>{
    console.log("MongoDB connection error. Please make sure that MongoDB is running.");
    process.exit(1);
    });
}