const express = require('express');
const router = require("./api/router");
var bodyParser = require('body-parser');
const app = express();  
const cors = require('cors');
const server = require("http").Server(app);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.use('/api',router);

app.get('*', (req, res) => {
    res.send("ERROR!");
    // res.sendFile(path.join(config.DIR, 'client/index.html'));  
});

server.listen(process.env.PORT || 5000, () => {
    console.log(`Started server on => http://localhost:5000`);
});