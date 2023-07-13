require('dotenv').config({ path: 'variaveis.env' });
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const routes = require('./routes');
const db = require('./db');

const server = express();

server.use(cors());
server.use(bodyParser.json()); // Analisar o corpo como JSON
server.use('/api', routes);


server.listen(process.env.PORT, () => {
  console.log(`Servidor em: http://localhost:${process.env.PORT}`);
});
