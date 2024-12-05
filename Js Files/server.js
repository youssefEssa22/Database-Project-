const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

root = path.join(__dirname, '..')

app.use(express.static(root));

app.get('/', (req, res) => {
  res.sendFile(path.join(root, 'Html Files/Main_Page.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});