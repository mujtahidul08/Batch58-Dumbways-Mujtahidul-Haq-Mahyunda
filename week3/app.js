const express = require('express')
const app = express()
const port = 3000
const hbs = require('hbs')

//helper function
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
  
    return `${date} ${month} ${year} ${hours}:${minutes}`;
})

app.set('view engine', 'hbs');

// Public File
app.use("/asset", express.static("asset"));
app.use("/css", express.static("css"));
app.use("/javascript", express.static("javascript"));
app.use("/views", express.static("views"));

app.use(express.json())
app.use(express.urlencoded({extended: true}))

//  data array blogs
const blogs = []

// Routing

//GET data
app.get('/', (req, res) => {
    res.render('index')
});

app.get('/blog', (req, res) => {
    res.render('blog',{blogs})
});

app.get('/contact', (req, res) => {
    res.render('contact')
});

app.get('/testimonial', (req, res) => {
    res.render('testimonial')
});

app.get('/blogDetail/:id', (req, res) => {
  const id = req.params.id;
  const blog = blogs.find((blog, idx) => idx == id); // Temukan blog berdasarkan index

  if (blog) {
      const { title, content } = blog;
      res.render('blogDetail', { id, title, content });
  } else {
      res.status(404).send("Blog not found");
  }
});

app.get('/edit-blog/:index', (req, res) => {
    const { index } = req.params;
    const blog = blogs.find((_, idx) => idx == index);
    console.log("blog yang diedit",blog)
    res.render('blogEdit',{blog, index})
})

// POST DATA
app.post('/blog', (req, res) => {
  const { title, content, startDate, endDate, nodejs, reactjs, nextjs, typescript } = req.body;
  blogs.unshift({
      title,
      content,
      image:"https://www.indiewire.com/wp-content/uploads/2023/07/oppenheimer-cillian.webp",
      createdAt :new Date(),
      durasi: hbs.handlebars.helpers.get_duration(startDate, endDate),
      author:"Mujtahidul Haq Mahyunda",
      reactjs: reactjs ? `<i class="fa-brands fa-react"></i>`: "",
      nodejs: nodejs ?  `<i class="fa-brands fa-node"></i>` : "",
      nextjs: nextjs ? `<i class="fa-brands fa-vuejs"></i>` : "",
      typescript: typescript ? `<i class="fa-brands fa-js"></i>` : "",
  })

  res.redirect('/blog')
});

app.post('/delete-blog/:index',(req, res) => {
  const {index} = req.params
  blogs.splice(index, 1)
  res.redirect('/blog')
})

app.post('/edit-blog/:index', (req, res) => {
  const {index} = req.params;
  const {title, content, startDate, endDate, reactjs, nodejs, nextjs, typescript } = req.body; 
  console.log(req.body);
  blogs[index] = {
      title,
      content,
      image: "https://www.indiewire.com/wp-content/uploads/2023/07/oppenheimer-cillian.webp",
      createdAt: new Date(),
      durasi: hbs.handlebars.helpers.get_duration(startDate, endDate),
      author: "Mujtahidul Haq Mahyunda",
      reactjs: reactjs ? `<i class="fa-brands fa-react"></i>` : "",
      nodejs: nodejs ? `<i class="fa-brands fa-node"></i>` : "",
      nextjs: nextjs ? `<i class="fa-brands fa-vuejs"></i>` : "",
      typescript: typescript ? `<i class="fa-brands fa-js"></i>` : "",
  };
  
  res.redirect('/blog');
});

app.listen(port, () => {
    console.log(`server sedang berjalan di port ${port}`);
});