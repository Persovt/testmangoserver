const express = require('express')
const mongoose = require('mongoose')
const config = require('config');
const { route } = require('./routes/auth.router');

const app = express()
const PORT = config.get('port') || 80;

app.use(express.json({extended: true}))

app.use('/api/auth', require('./routes/auth.router'))
const  start = async() => {
   try {
       await mongoose.connect(config.get('mongoURL'), {
        useNewUrlParser : true, 
        useCreateIndex : true,
         useUnifiedTopology : true
       })
       app.listen(PORT, () => console.log(`server is running on port ` + PORT) )
   } catch (error) {
       console.log(`Server is error: ${error}`)
       process.exit(1)
   }
}

start()

