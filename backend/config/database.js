const mongoose = require('mongoose');

const ConnectDatabase=()=>{
    mongoose.connect(process.env.db_Url).then((data)=>{
        console.log(`mongoDB connected with server ${data.connection.host}`)
    })
}

module.exports=ConnectDatabase