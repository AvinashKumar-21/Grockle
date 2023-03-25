const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserModel = require("./models/Users");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const Place = require("./models/PlaceSchema");
require("dotenv").config();
const multer = require("multer");
const app = express();
const secret = bcrypt.genSaltSync(12);
const fs = require("fs");
const BookingModel = require("./models/booking");
const path = require("path");
const jwtScreat = "sdgdtr";
const bucket = "grockelfile";
const mime = require("mime-types");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
mongoose.set("strictQuery", true);

app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.json());
app.use(cors({ credentials: true, origin: "http://localhost:5173" }));

async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

app.get("/test", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json("Test ok.");
});

app.post("/register", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { name, email, password } = req.body;
  try {
    const user = await UserModel.create({
      name,
      email,
      password: bcrypt.hashSync(password, secret),
    });
    res.json(user);
  } catch (e) {
    res.status(422).json(e);
  }
});
app.post("/login", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { email, password } = req.body;
  const userDocument = await UserModel.findOne({ email });
  if (userDocument) {
    const passOK = bcrypt.compareSync(password, userDocument.password);
    if (passOK) {
      jwt.sign(
        {
          email: userDocument.email,
          id: userDocument._id,
        },
        jwtScreat,
        {},
        (err, token) => {
          if (err) throw err;
          else res.cookie("token", token).json(userDocument);
        }
      );
    } else {
      res.status(422).json("pass not ok");
    }
  } else {
    res.status(422).json("not found");
  }
});
app.get("/profile", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  if (token) {
    jwt.verify(token, jwtScreat, {}, async (err, userData) => {
      if (err) throw err;
      const { name, email, _id } = await UserModel.findById(userData.id);
      res.json({ name, email, _id });
    });
  } else res.json(null);
});
app.post("/logout", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.cookie("token", "").json(true);
});
app.post("/upload-by-link", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { link } = req.body;
  const newName = "photo" + Date.now() + ".jpg";
  await imageDownloader.image({
    url: link,
    dest: "/tmp/" + newName,
  });
  const url = await uploadToS3(
    "/tmp/" + newName,
    newName,
    mime.lookup("/tmp/" + newName)
  );
  res.json(url);
});
const photosMiddleware = multer({ dest: "/tmp" });

app.post("/upload", photosMiddleware.array("photos", 100), async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const uploadedFiles = [];
  for (let i = 0; i < req.files.length; i++) {
    const { path, originalname, mimetype } = req.files[i];
    uploadedFiles.push(await uploadToS3(path, originalname, mimetype));
  }
  res.json(uploadedFiles);
});

app.post("/places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const {
    title,
    address,
    addPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;
  const { token } = req.cookies;
  jwt.verify(token, jwtScreat, {}, async (err, userData) => {
    if (err) throw err;
    const placeDoc = await Place.create({
      owner: userData.id,
      title,
      address,
      photos: addPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    });
    res.json(placeDoc);
  });
});
app.get("/place/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});

app.get("/user-places", (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtScreat, {}, async (err, userData) => {
    const { id } = userData;
    res.json(await Place.find({ owner: id }));
  });
});
app.get("/places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  res.json(await Place.findById(id));
});
app.put("/places", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const {
    id,
    title,
    address,
    addPhotos,
    description,
    perks,
    extraInfo,
    checkIn,
    checkOut,
    maxGuests,
    price,
  } = req.body;

  jwt.verify(token, jwtScreat, {}, async (err, userData) => {
    const placeDoc = await Place.findById(id);
    if (userData.id === placeDoc.owner.toString()) {
      placeDoc.set({
        title,
        address,
        photos: addPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });
      await placeDoc.save();
      res.json("Ok");
    }
  });
});
app.get("/all", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  res.json(await Place.find());
});

app.post("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  const userData = await jwt.verify(
    token,
    jwtScreat,
    {},
    async (err, userData) => {
      if (err) throw err;
      return userData;
    }
  );
  const user = userData.id;
  const { name, mobile, checkIn, checkOut, place, maxGuest, price } = req.body;
  const doc = await BookingModel.create({
    name,
    mobile,
    checkIn,
    checkOut,
    place,
    maxGuest,
    price,
    user,
  });
  res.json(doc);
});
app.get("/bookings", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { token } = req.cookies;
  jwt.verify(token, jwtScreat, {}, async (err, userData) => {
    if (err) throw err;
    return res.json(
      await BookingModel.find({ user: userData.id }).populate("place")
    );
  });
});
app.delete("/delete/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const newDOc = await BookingModel.deleteOne({ _id: id });
  res.json(newDOc);
});
app.delete("/user-places/:id", async (req, res) => {
  mongoose.connect(process.env.MONGO_URL);
  const { id } = req.params;
  const newDoc = await Place.deleteOne({ _id: id });
  res.json(newDoc);
});
app.listen(4000);
