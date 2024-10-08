const express = require('express');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const port = 3000;

// Připojení k MySQL databázi
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Chyba při připojení k MySQL:', err);
  } else {
    console.log('Připojeno k MySQL.');
  }
});

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
// Zobrazení blogových příspěvků
app.get('/', (req, res) => {
  const sql = 'SELECT * FROM posts';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.render('index', { posts: results });
  });
});

app.listen(port, () => {
  console.log(`Server běží na http://localhost:${port}`);
});

// Endpoint pro přidání nového příspěvku
app.post('/add-post', (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send('Title and content are required.');
  }

  const sql = 'INSERT INTO posts (title, content) VALUES (?, ?)';
  db.query(sql, [title, content], (err, result) => {
    if (err) throw err;
    console.log('Příspěvek byl přidán');
    res.redirect('/'); // Přesměrujeme zpět na hlavní stránku po úspěšném přidání
  });
});
