require('dotenv').config();
const express = require('express');
const fileupload = require('express-fileupload');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileupload({
    useTempFiles: true,
    tempFileDir: '/tmp/',
  })
);

app.get('/getform', (req, res) => {
  res.render('getform');
});

app.get('/postform', (req, res) => {
  res.render('postform');
});

app.get('/myget', (req, res) => {
  console.log(req.query);
  res.send(req.query);
});

app.post('/mypost', async (req, res) => {
  // simple single file upload
  // let file = req.files.file;

  // const result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   folder: 'users',
  // });

  let result;
  let imageArray = [];

  if (req.files) {
    for (let i = 0; i < req.files.file.length; i++) {
      const file = req.files.file[i];
      result = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: 'users',
      });

      imageArray.push({
        public_id: result.public_id,
        secure_url: result.secure_url,
      });
    }
  }

  const details = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    // result,
    imageArray,
  };

  res.send(details);
});

app.listen(3000, () => console.log('listening on port 3000'));
