function clearFormInputs() {
  document.getElementById("inputTitle").value = "";
  document.getElementById("inputContent").value = "";
  document.getElementById("inputImage").value = "";
  document.getElementById("startDate").value = "";
  document.getElementById("endDate").value = "";
  document.getElementById("nodejs").checked = false;
  document.getElementById("reactjs").checked = false;
  document.getElementById("nextjs").checked = false;
  document.getElementById("typescript").checked = false;
}

function getDuration(startDate, endDate) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const duration = Math.floor(end - start); // Menghitung selisih dalam milidetik
  
  // Menghitung jumlah hari
  const distanceDays = Math.floor(duration/(1000*60*60*24));
  // Menghitung jumlah bulan
  const distanceMonth = Math.floor(duration / (1000 * 60 * 60 * 24 * 30));
  // Menghitung jumlah tahun
  const distanceYear = Math.floor(duration / (1000 * 60 * 60 * 24 * 30* 365));

  console.log(distanceDays);
  console.log(distanceMonth);
  console.log(distanceYear);

  if (distanceDays < 31) {
    return `${distanceDays} Hari`;
  } else if (distanceMonth < 366) {
    return `${distanceMonth} Bulan`;
  } else if (distanceYear > 365) {
    return `${distanceYear} Tahun`;
  } 
}

function getFullTime(tanggal) {
 
  const date = tanggal.getDate();
  const month = tanggal.getMonth();
  const year = tanggal.getFullYear();
  let hours = tanggal.getHours();
  let minutes = tanggal.getMinutes();

  if (hours <= 9) {
    hours = "0" + hours;
  }

  // ketika ditampilkan yang tadinya 8:45, menjadi 08:45

  // jam 10:00
  // jam 07:00
  // jam 06:00

  if (minutes <= 9) {
    minutes = "0" + minutes;
  }

  return `${date} ${month} ${year} ${hours}:${minutes}`;
}

function getDistanceTime(time) {
  const timeNow = new Date().getTime(); //ini ngambil waktu saat ini
  const timePosted = time;

  const distance = timeNow - timePosted; //ms atau miliseconds

  // math :
  // floor -> ini akan membulatkan angka kebawah : 8.9 -> 8
  // round -> dibulatkan ke yg terdekat: 9.7 -> 9 | 8.2 akan jadi 8
  // ceil -> dibulatkan ke atas : 8.7 -> 9

  const distanceSeconds = Math.floor(distance / 1000); // 1000 melambangkan setiap detik, karna 1 detika 1000 ms
  const distanceMinutes = Math.floor(distance / 1000 / 60); // 60 melambangkan 1 menit
  const distanceHours = Math.floor(distance / 1000 / 60 / 60); // 60 melambangkan 1 jam
  const distanceDay = Math.floor(distance / 1000 / 60 / 60 / 24); // 24 melambangkan 1 hari yaitu 24 jam

  console.log(distanceSeconds);
  console.log(distanceMinutes);
  console.log(distanceHours);
  console.log(distanceDay);

  if (distanceDay > 0) {
    return `${distanceDay} Day Ago`;
  } else if (distanceHours > 0) {
    return `${distanceHours} Hours Ago`;
  } else if (distanceMinutes > 0) {
    return `${distanceMinutes} Minutes Ago`;
  } else if (distanceSeconds > 0) {
    return `${distanceSeconds} Seconds Ago`;
  }
}

let dataBlog = [];

function submitBlog(event) {
  event.preventDefault();

  let inputTitle = document.getElementById("inputTitle").value;
  let inputContent = document.getElementById("inputContent").value;
  let inputImage = document.getElementById("inputImage").files;
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;
  let nodejs = document.getElementById("nodejs").checked;
  let reactjs = document.getElementById("reactjs").checked;
  let nextjs = document.getElementById("nextjs").checked;
  let typescript = document.getElementById("typescript").checked;
  const duration = getDuration(startDate, endDate);

  if (inputTitle == "") {
    alert("title harus diisi");
  } else if (inputContent == "") {
    alert("content harus diisi");
  } else if (inputImage == "") {
    alert("file harus diisi");
  }

  // mengabil sumber dari file image(jpn/png)
  inputImage = URL.createObjectURL(inputImage[0]);

  // data ini akan kita masukkan kedalam sebuah array
  const blog = {
    title: inputTitle,
    content: inputContent,
    image: inputImage,
    // ini si posted add referance dari penulisan inggris
    postAt: new Date(),
    waktu: startDate+" s/d "+endDate,
    durasi: duration,
    author: "Mujtahidul Haq Mahyunda",
    reactjs: reactjs ? `<i class="fa-brands fa-react" ></i>` : "",
    nodejs: nodejs ?  `<i class="fa-brands fa-node"></i>` : "",
    nextjs: nextjs ? `<i class="fa-brands fa-vuejs"></i>` : "",
    typescript: typescript ? `<i class="fa-brands fa-js"></i>` : "",
  };

  dataBlog.push(blog);
  console.log("dataArray:", dataBlog);
  renderBlog();

  // Mengosongkan isian input form setelah render blog selesai
  clearFormInputs();
}

// Jika perkondisian dalam 1 baris yang sama kita bisa menggunakan yang namanya TERNARI (?) ini berdasarkan nilai boolean

function renderBlog() {
  document.getElementById("content").innerHTML = "";
  for (let index = 0; index < dataBlog.length; index++) {
    document.getElementById("content").innerHTML += `
            <div class="blog-list-items">
                <div class="blog-image">
                    <img src="${dataBlog[index].image}" alt="image upload" style="font-size=10px;"/>
                </div>
                <div class="blog-content">
                  <h1>
                    <a href="blogDetail.html" target="_black">${dataBlog[index].title}</a>
                  </h1>
                  <div class="detail-blog">
                    ${getFullTime(dataBlog[index].postAt)} | ${dataBlog[index].author}
                  </div>
                  <div class="bahasaProgram">
                  ${dataBlog[index].nodejs}
                  ${dataBlog[index].reactjs }
                  ${dataBlog[index].nextjs}
                  ${dataBlog[index].typescript}
                  </div>
                  <div class="isi">
                    <h2>
                      ${dataBlog[index].content}
                    </h2>  
                  </div>
                    <p>
                    Durasi:${dataBlog[index].durasi}
                    </p>
                    <div class="btn-group" style="display=flex;">
                        <button class="btn-edit"> Edit Blog </button>
                        <button class="btn-post"> Post Blog </button>
                    </div>
                </div>
            </div>
        `;
  }
}

setInterval(function () {
  renderBlog();
}, 1000);