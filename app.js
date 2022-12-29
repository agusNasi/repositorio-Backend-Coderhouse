const express = require('express');
const app = express();
const apiRoutes = require('./routers/app.routers');


app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api', apiRoutes);







app.listen(8080,() => console.log('server arriba'));