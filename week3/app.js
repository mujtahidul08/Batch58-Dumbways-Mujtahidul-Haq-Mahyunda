const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs')

// sequelize init
const config = require("./config/config.json")
const { Sequelize, QueryTypes } = require("sequelize")
const sequelize = new Sequelize(config.development)

//bycrpit
const bcrypt = require("bcrypt");

const session = require("express-session");
const flash = require("express-flash");
// const upload = require("./src/middlewares/upload-file");


//helper function
hbs.registerHelper('split', (str = "", delimiter, value) => str.split(delimiter).includes(value));
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


app.get('/', (req, res) => {
  const user = req.session.user;
  console.log(user);

  res.render("index", { user });
});

app.get('/blog', async (req, res) => {
  const query = 'SELECT * FROM project';
  let blogs = await sequelize.query(query, { type: QueryTypes.SELECT });
  blogs = blogs.map((blog) => ({
    ...blog,
    author: "mujtahidul Haq Mahyunda",
  }));
  res.render('blog', { blogs });
});

app.get('/contact', (req, res) => {
    res.render('contact')
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial')
});
app.get('/login', (req, res) => {
  res.render('login')
});
app.get('/register', (req, res) => {
  res.render('register')
});

app.get('/blogDetail/:id', async (req, res) => {
  const id = req.params.id; // Ubah ini untuk mengambil id dengan benar
  const query = `SELECT * FROM project WHERE id = ${id}`;
  const blog = await sequelize.query(query, { type: QueryTypes.SELECT });
  blog[0].author = "Mujtahidul Haq Mahyunda"
  res.render('blogDetail', { blog: blog[0] }); 
});

app.get('/edit-blog/:id', async (req, res) => {
  const id = req.params.id;
  const query = `SELECT * FROM project WHERE id = ${id}`;
  const blog = await sequelize.query(query, { type: QueryTypes.SELECT });
  blog[0].author = "Mujtahidul Haq Mahyunda"
  res.render('blogEdit', { blog: blog[0] }); 
})

// POST DATA
// app.post('/blog', async (req, res) => {
//   const { title, content, startDate, endDate, nodejs, reactjs, nextjs, typescript } = req.body;
  
// const technologies = [
//     nodejs ? 'nodejs' : null,
//     reactjs ? 'reactjs' : null,
//     nextjs ? 'nextjs' : null,
//     typescript ? 'typescript' : null,
// ].filter(Boolean).join(','); // Mengubah array menjadi string

//   const query = `
//     INSERT INTO project (title, content, image, technologies, "startDate", "endDate", author_id)
//     VALUES ('${title}', '${content}', 'https://images7.alphacoders.com/367/367217.jpg', '${technologies}', '${startDate}', '${endDate}', 2)
//     RETURNING *;
//   `;
//   const [blog] = await sequelize.query(query, { type: QueryTypes.INSERT });
//   console.log(blog[0])
//   res.redirect('/blog');
// });


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

app.post('/blog', async (req, res) => {
  const { title, content, startDate, endDate, technologies } = req.body;

  // technologies akan menjadi array, jadi Anda tidak perlu melakukan filter dan join.
  const technologiesString = technologies ? technologies.join(',') : '';

  const query = `
      INSERT INTO project (title, content, image, technologies, "startDate", "endDate", author_id)
      VALUES ('${title}', '${content}', 'https://images7.alphacoders.com/367/367217.jpg', '${technologiesString}', '${startDate}', '${endDate}', 2)
      RETURNING *;
  `;
  const [blog] = await sequelize.query(query, { type: QueryTypes.INSERT });
  console.log(blog[0]);
  res.redirect('/blog');
});

app.post('/delete-blog/:id',(req, res) => {
  const {id} = req.params
  blogs.splice(id, 1)
  res.redirect('/blog')
})

app.post('/edit-blog/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, startDate, endDate, reactjs, nodejs, nextjs, typescript } = req.body;

  const technologies = [
    nodejs ? 'nodejs' : null,
    reactjs ? 'reactjs' : null,
    nextjs ? 'nextjs' : null,
    typescript ? 'typescript' : null,
  ].filter(Boolean).join(',');

  const query = `
    UPDATE project
    SET title = '${title}', content = '${content}', image = 'https://www.indiewire.com/wp-content/uploads/2023/07/oppenheimer-cillian.webp',
        technologies = '${technologies}', "startDate" = '${startDate}', "endDate" = '${endDate}', updatedAt = NOW()
    WHERE id = ${id}
    RETURNING *;
  `;
  const [updatedBlog] = await sequelize.query(query, { type: QueryTypes.UPDATE });
  console.log('Blog updated:', updatedBlog[0]);
  res.redirect('/blog');
});

app.listen(port, () => {
    console.log(`server sedang berjalan di port ${port}`);
});