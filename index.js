// Importing modules
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const db = require("./config/dbVinyl");
const { compare, hash } = require("bcrypt");
// Error handling
const createError = require("./middleware/errorHandling.js");
// Express app
const app = express();
// Express router
const router = express.Router();
// Configuration
const port = parseInt(process.env.PORT) || 4000;

app.use((req, res, next) => {
  // res.setHeader("Access-Control-Allow-Origin", "*");
  res.set({
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Methods": "*",
  });
  next();
});

app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}))

app.use(
  express.static("public"),
  router,
  express.json(),
  express.urlencoded({
    extended: true,
  })
);

//
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
// home
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});
// Get users
// router.get("/users", (req, res) => {
//   let strQry = `SELECT user_id, user_fullname, user_role, email, user_password
//     FROM users`;
//   db.query(strQry, (err, results) => {
//     if (err) throw err;
//     res.status(200).json({
//       results: results,
//     });
//   });
// });


// Get users
router.get("/register", (req, res) => {
  let strQry = `SELECT user_id, user_fullname, user_role, email, user_password
    FROM users`;
  db.query(strQry, (err, results) => {
    if (err) throw err;
    res.status(200).json({
      results: results,
    });
  });
});

// User registration
router.post("/register", bodyParser.json(), (req, res) => {
  // Retrieving data that was sent by the user
  // id, firstname, lastname, email, userpassword, usertype
  let { user_fullname, email, user_password, user_role } = req.body;
  // If the userRole is null or empty, set it to "user".
  if (user_role.length === 0) {
    if (user_role.includes() !== "user" || user_role.includes() !== "admin")
      user_role = "user";
  }
  // Check if a user already exists
  let strQry = `SELECT email, user_password
    FROM users
    WHERE LOWER(email) = LOWER('${email}')`;
  db.query(strQry, async (err, results) => {
    if (err) {
      throw err;
    } else {
      if (results.length) {
        res.status(409).json({ msg: "User already exist" });
      } else {
        // Encrypting a password
        // Default value of salt is 10.
        user_password = await hash(user_password, 10);
        // Query
        strQry = `
                INSERT INTO users(user_fullname, email, user_password, user_role)
                VALUES(?, ?, ?, ?);
                `;
        db.query(
          strQry,
          [user_fullname, email, user_password, user_role],
          (err, results) => {
            if (err) throw err;
            res
              .status(201)
              .json({
                msg: `number of affected row is: ${results.affectedRows}`,
              });
          }
        );
      }
    }
  });
});
// Login
router.post("/login", bodyParser.json(), (req, res) => {
  // Get email and password
  const { email, user_password } = req.body;
  // console.log(userpassword);
  const strQry = `
    SELECT *
    FROM users 
    WHERE email = '${email}' ;
    `;
  db.query(strQry, async (err, results) => {
    // In case there is an error
    console.log(results)
    if (err) throw err;
    // When user provide a wrong email
    if (!results.length) {
      res.status(401).json({ msg: "You provided the wrong email." });
    }
    // Authenticating a user
    await compare(
      user_password,
      results[0].user_password,
      (cmpErr, cmpResults) => {
        if (cmpErr) {
          res.status(401).json({
            msg: "You provided the wrong password",
          });
        }
        // Apply a token and it will expire within 1 hr.
        if (cmpResults) {
          const token = jwt.sign(
            {
              id: results[0].id,
              user_fullname: results[0].user_fullname,
              email: results[0].email,
            },
            process.env.TOKEN_KEY,
            {
              expiresIn: "1h",
            },
            (err, token) => {
              if (err) throw err;
              // Login
              res.status(200).json({
                msg: "Logged in",
                token,
                results: results[0],
              });
            }
          );
        }
      }
    );
  });
});
// Create new products
router.post("/products", bodyParser.json(), (req, res) => {
  const bd = req.body;
  bd.totalamount = bd.quantity * bd.price;
  // Query
  const strQry = `
    INSERT INTO products(title, genre,  product_description, img, img2, img3, price, quantity)
    VALUES(?, ?, ?, ?, ?, ? , ?, ?);
    `;
  //
  db.query(
    strQry,
    [
      bd.title,
      bd.genre,
      bd.product_description,
      bd.img,
      bd.img2,
      bd.img3,
      bd.price,
      bd.quantity,
    ],
    (err, results) => {
      if (err) throw err;
      res.json({
        msg: "Product added, Please refresh"
      });
    }
  );
});
// Get all products
router.get("/products", (req, res) => {
  // Query
  const strQry = `
    SELECT *
    FROM products;
    `;
  db.query(strQry, (err, results) => {
    if (err) throw err;
    res.json({
      status: 200,
      results: results,
    });
  });
});

// Get one product
router.get("/products/:id", (req, res) => {
  // Query
  const strQry = `
    SELECT product_id,title, genre,  product_description, img, img2, img3, price, quantity, created_by
    FROM products
    WHERE product_id = ?;
    `;
  db.query(strQry, [req.params.id], (err, results) => {
    if (err) throw err;
    res.json({
      status: 200,
      results: results.length <= 0 ? "Sorry, no product was found." : results,
    });
  });
});
// Update product
router.put("/products", (req, res) => {
  const bd = req.body;
  // Query
  const strQry = `UPDATE products
     SET ?
     WHERE created_by = ?`;

  db.query(strQry, [bd.id], (err, data) => {
    if (err) throw err;
    res.send(`number of affected record/s: ${data.affectedRows}`);
  });
});

// Delete product
router.delete("/products/:id", (req, res) => {
  // Query
  const strQry = `
    DELETE FROM products 
    WHERE created_by = ?;
    `;
  db.query(strQry, [req.params.id], (err, data, fields) => {
    if (err) throw err;
    res.send(`${data.affectedRows} row was affected`);
  });
});
app.use(createError);

// Cart Add
app.get("/users/:id/cart", (req, res) => {
  let sql = `SELECT cart FROM users WHERE user_id =${req.params.id}`;
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.json({
      status: 200,
      results: JSON.parse(results[0].cart),
    });
  });
});

app.post("/users/:id/cart", bodyParser.json(), (req, res) => {
  let bd = req.body;
  let sql = `SELECT cart FROM users WHERE user_id = ${req.params.id}`;
  db.query(
    sql,
    (err, results) => {
      if (err) throw err;
      if (results.length > 0) {
        let cart;
        if (results[0].length == null) {
          cart = [];
        } else {
          cart = JSON.parse(results[0].cart);
        }
        let product = {
          "p_id": cart.length + 1,
          "title": bd.title,
          "category": bd.category,
          "product_description": bd.product_description,
          "img": bd.img,
          "img2": bd.img2,
          "img3": bd.img3,
          "price": bd.price,
          "quantity": bd.quantity,
        };

        cart.push(product);
        let sql1 = `UPDATE users SET cart = ? WHERE user_id = ${req.params.id}`;

        db.query(sql1, JSON.stringify(cart), (err, results) => {
          if (err) throw results;
          res.send(`Product add to your cart`);
        });
      } //me
    } //you
  );
});

app.delete("users/:id/cart", bodyParser.json(), (req, res) => {
  let bd = req.body;
  let sql = `UPDATE users SET cart = null WHERE user_id = ${req.params.id}`;

  db.query(sql, (err, results) => {
    if (err) throw errres.send("Cart is empty");
  });
});

