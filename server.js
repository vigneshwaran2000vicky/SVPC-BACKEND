// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');

// const app = express();
// const port = 3001;

// app.use(bodyParser.json());
// app.use(cors());

// mongoose.connect('mongodb+srv://laddusriva:vicky007@cluster0.xzvwhnz.mongodb.net/srivinagaya?retryWrites=true&w=majority&appName=Cluster0', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => {
//   console.log("Connected to MongoDB");
// }).catch((err) => {
//   console.error("Error connecting to MongoDB:", err.message);
// });

// const UserSchema = new mongoose.Schema({
//   username: String,
//   password: String,
//   email: String
// });

// const User = mongoose.model('User', UserSchema);

// // Register a new user
// app.post('/register', async (req, res) => {
//   const { username, password, email } = req.body;
//   const hashedPassword = await bcrypt.hash(password, 10);
//   const user = new User({ username, password: hashedPassword, email });
//   await user.save();
//   res.send('User registered');
// });

// // Login a user
// app.post('/login', async (req, res) => {
//   const { username, password } = req.body;
//   const user = await User.findOne({ username });

//   if (user && await bcrypt.compare(password, user.password)) {
//     const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
//     res.json({ token });
//   } else {
//     res.status(401).send('Invalid credentials');
//   }
// });

// // Middleware to authenticate JWT
// const authenticateToken = (req, res, next) => {
//   const authHeader = req.headers['authorization'];
//   const token = authHeader && authHeader.split(' ')[1];

//   if (token == null) return res.sendStatus(401);

//   jwt.verify(token, 'your_jwt_secret', (err, user) => {
//     if (err) return res.sendStatus(403);
//     req.user = user;
//     next();
//   });
// };

// // Get user profile
// app.get('/profile', authenticateToken, async (req, res) => {
//   const user = await User.findOne({ username: req.user.username });
//   if (user) {
//     res.json({
//       username: user.username,
//       email: user.email
//       // Add more profile details as needed
//     });
//   } else {
//     res.status(404).send('User not found');
//   }
// });

// app.listen(port, () => {
//   console.log(`Server running on http://localhost:${port}`);
// });

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://laddusriva:vicky007@cluster0.xzvwhnz.mongodb.net/SRIVINAYAGAMISION?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
  console.error("Error connecting to MongoDB:", err.message);
});;

const UserSchema = new mongoose.Schema({
  name: String,
  username: String,
  password: String,
  email: String,
  contact: String,
  age: Number,
  gender: String,
  fatherName: String,
  motherName: String,
  religion: String,
  nationality: String,
  address: String
});

const User = mongoose.model('User', UserSchema);

// Register a new user
app.post('/register', async (req, res) => {
  const {
    name, username, password, email, contact, age, gender, fatherName, motherName,
    religion, nationality, address
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name, username, password: hashedPassword, email, contact, age, gender, fatherName,
    motherName, religion, nationality, address
  });

  try {
    await user.save();
    res.send('User registered');
  } catch (error) {
    res.status(400).send('Error registering user: ' + error.message);
  }
});

// Login a user
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });

  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(401).send('Invalid credentials');
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, 'your_jwt_secret', (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Get user profile
app.get('/profile', authenticateToken, async (req, res) => {
  const user = await User.findOne({ username: req.user.username });
  if (user) {
    res.json({
      name: user.name,
      username: user.username,
      email: user.email,
      contact: user.contact,
      age: user.age,
      gender: user.gender,
      fatherName: user.fatherName,
      motherName: user.motherName,
      religion: user.religion,
      nationality: user.nationality,
      address: user.address
      // Add more profile details as needed
    });
  } else {
    res.status(404).send('User not found');
  }
});

// Update user profile
app.put('/profile', authenticateToken, async (req, res) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { username: req.user.username },
      req.body,
      { new: true }
    );
    res.json(updatedUser);
  } catch (error) {
    res.status(400).send('Error updating profile: ' + error.message);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});