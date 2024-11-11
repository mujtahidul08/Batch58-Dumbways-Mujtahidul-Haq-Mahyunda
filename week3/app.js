const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs')

// sequelize init
const config = require("./config/config")
const { Sequelize, QueryTypes } = require("sequelize")

const sequelize = new Sequelize('db_personal_web', 'postgres', 'mahyunda081001', {
    host: 'localhost',
    dialect: 'postgres', // Sesuaikan dengan database Anda
    dialectOptions: {
        ssl: false // Tambahkan ini untuk menonaktifkan SSL
    }
});

module.exports = sequelize;
//bycrpit
const bcrypt = require("bcrypt");

const session = require("express-session");
const flash = require("express-flash");
const upload = require('./middlewares/upload-file')


//helper function
hbs.registerHelper('split', function (array, value) {
  if (!array) return false;
  return array.includes(value);
});
hbs.registerHelper('eq', (a, b) => a === b);

hbs.registerHelper('get_duration',(startDate,endDate) => {
    const start = new Date(startDate);
  const end = new Date(endDate);

  const duration = Math.floor(end - start); // Menghitung selisih dalam milidetik
  
  // Menghitung jumlah hari
  const distanceDays = Math.floor(duration/(1000*60*60*24));
  // Menghitung jumlah bulan
  const distanceMonth = Math.floor(duration / (1000 * 60 * 60 * 24 * 30));
  // Menghitung jumlah tahun
  const distanceYear = Math.floor(duration / (1000 * 60 * 60 * 24 * 30* 365));

  if (distanceDays < 31) {
    return `${distanceDays} Hari`;
  } else if (distanceMonth < 12) {
    return `${distanceMonth} Bulan`;
  } else {
    return `${distanceYear} Tahun`;
  } 
});


hbs.registerHelper('get_full_time', (tanggal) => {
    const date = tanggal.getDate();
    const month = tanggal.getMonth()+1;
    const year = tanggal.getFullYear();
    let hours = tanggal.getHours();
    let minutes = tanggal.getMinutes();
  
    if (hours <= 9) {
      hours = "0" + hours;
    }
  
    // ketika ditampilkan yang tadinya 8:45, menjadi 08:45
  
    if (minutes <= 9) {
      minutes = "0" + minutes;
    }
  
    return `${date}-${month}-${year} ${hours}:${minutes}`;
})

app.set('view engine', 'hbs');

// Public File
app.use("/asset", express.static("asset"));
app.use("/css", express.static("css"));
app.use("/javascript", express.static("javascript"));
app.use("/views", express.static("views"));
app.use("/uploads", express.static("uploads"));


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(session({
  name: "my-session",
  secret: "mujtahidul",
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false, maxAge: 1000 * 60 * 60 * 24 },
}));
app.use(flash());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routing

//GET data
app.get('/login', (req, res) => {
  res.render('login')
});

app.get('/register', async (req, res) => {
  res.render('register')
});


app.get('/', async (req, res)  => {
  const query = 'SELECT  blogs.*, users.name FROM blogs INNER JOIN users ON blogs.author_id = users.id';
  let blogs = await sequelize.query(query, { type: QueryTypes.SELECT });
  user = req.session.user;
  blogs = blogs.map(blog => {
    try {
      blog.technologies = JSON.parse(blog.technologies);
    } catch (error) {
      blog.technologies = []; // Set default array jika gagal
    }
    return blog;
  });
  res.render('index', { blogs, user});
});

app.get('/blog',async (req, res) => {
  const query = 'SELECT  blogs.*, users.name FROM blogs INNER JOIN users ON blogs.author_id = users.id';
  let blogs = await sequelize.query(query, { type: QueryTypes.SELECT });
  const user = req.session.user;
  res.render('blog', { blogs, user});
});

app.get('/contact', (req, res) => {
  const user = req.session.user;
    res.render('contact', {user})
});

app.get('/testimonial', (req, res) => {
  const user = req.session.user;
    res.render('testimonial', {user})
});
app.get('/login', (req, res) => {
  res.render('login')
});
app.get('/register', (req, res) => {
  res.render('register')
});

app.get('/blogDetail/:id', async (req, res) => {
  const user = req.session.user;
  const id = req.params.id; // Ubah ini untuk mengambil id dengan benar
  const query = `
    SELECT blogs.*, users.name
    FROM blogs
    INNER JOIN users ON blogs.author_id = users.id
    WHERE blogs.id = ${id}`;
  const blog = await sequelize.query(query, { type: QueryTypes.SELECT });
  blog[0].technologies = JSON.parse(blog[0].technologies);
  blog[0].image = blog[0].image.replace(/\\/g, '/'); // Mengganti semua backslash menjadi slash
  console.log(blog[0]);
  res.render('blogDetail', { blog: blog[0], user }); 
});

app.get('/edit-blog/:id', async (req, res) => {
  const id = req.params.id;
  const user = req.session.user;
  const query = `SELECT * FROM blogs WHERE id = ${id}`;
  let blogs = await sequelize.query(query, { type: QueryTypes.SELECT });
  
  // Mengubah technologies menjadi array jika valid
  blogs = blogs.map(blog => {
    try {
      blog.technologies = JSON.parse(blog.technologies);
    } catch (error) {
      blog.technologies = []; // Set default array jika gagal
    }
    return blog;
  });

  // Akses blog yang pertama
  const blog = blogs[0];
  blog.image = blog.image.replace(/\\/g, '/'); 

  console.log(blog,user);
  res.render('blogEdit', {blog, user, id});
});

app.post('/register', async (req, res) => { 
  const { name, email, password } = req.body;
  const salt = 10;
  const hashedPassword = await bcrypt.hash(password, salt);

  const query = `INSERT INTO users(name, email, password) VALUES('${name}', '${email}', '${hashedPassword}')`;
  const user = await sequelize.query(query, { type: QueryTypes.INSERT });
  res.redirect('/login');
});

app.post('/login', async (req, res) => { 
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email='${email}'`;
  const user = await sequelize.query(query, { type: QueryTypes.SELECT });

  if (!user.length) {
    req.flash("error", "Email / password salah!");
    return res.redirect("/login");
  }

  const isVerifiedPassword = await bcrypt.compare(password, user[0].password);

  if (!isVerifiedPassword) {
    req.flash("error", "Email / password salah!");
    return res.redirect("/login");
  }

  req.flash("success", "Berhasil login!");
  req.session.user = user[0];
  res.redirect("/");
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Logout gagal!");
      return res.redirect("/"); 
    }
    console.log("Logout berhasil!");
    res.redirect("/"); 
  });
});

app.post('/blog', upload.single("image"),async (req, res) => {
  const { title, content, startDate, endDate, technologies} = req.body;
  const {id} = req.session.user;
  const imagePath = req.file.path;

  
  const technologiesString = JSON.stringify(Array.isArray(technologies) ? technologies : [technologies]);
  const query = `
      INSERT INTO blogs (title, content, image, technologies, "startDate", "endDate", author_id)
      VALUES ('${title}', '${content}', '${imagePath}', '${technologiesString}', '${startDate}', '${endDate}', '${id}')
      RETURNING *;
  `;
  const [blog] = await sequelize.query(query, { type: QueryTypes.INSERT });
  console.log(blog[0]);
  res.redirect('/blog');
});

app.post('/delete-blog/:id',async (req, res) => {
  const { id } = req.params;
  const query = `DELETE FROM blogs WHERE id=${id}`;
  await sequelize.query(query, { type: QueryTypes.DELETE });

  res.redirect("/");
})

app.post('/edit-blog/:id', upload.single("image"), async (req, res) => {
  const { id } = req.params;
  const userId = req.session.user.id; 
  const { title, content, startDate, endDate, technologies } = req.body;
  const imagePath = req.file.path;
  console.log("Technologies received from form:", technologies);
  // Konversi technologies ke string JSON
  const technologiesArray = Array.isArray(technologies) ? technologies : [technologies];
  const technologiesString = JSON.stringify(technologiesArray);
  const query = `
    UPDATE blogs
    SET title = '${title}', 
        content = '${content}', 
        image = '${imagePath}',
        technologies = '${technologiesString}', 
        "startDate" = '${startDate}', 
        "endDate" = '${endDate}', 
        "author_id" = '${userId}'
    WHERE id = ${id};
  `;

  // Menjalankan query update
  await sequelize.query(query, { type: QueryTypes.UPDATE });

  // Mengambil semua data blog
  const blogs = await sequelize.query(`SELECT * FROM blogs`, { type: QueryTypes.SELECT });

  console.log('Blog updated');
  res.redirect('/');
});

app.listen(port, () => {
    console.log(`server sedang berjalan di port ${port}`);
});