function fetchTestimonials(){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.open("GET", "https://api.npoint.io/cbd6f8e42c44b83950c4", true);
    xhr.onerror = () => {
      reject("network error!");
    }
    xhr.onload = () => {
      const parsed = JSON.parse(xhr.response);
      
      resolve(parsed);
    }
    
    xhr.send();

  })
}
  
  
async function getAllTestimonials() {
  const testimonials = await fetchTestimonials()
  
  
    const testimonialHTML = testimonials.map((testimonial) => {
      return `<div class="testimonial">
                <img src="${testimonial.image}" class="profile-testimonial" />
                <p class="quote">"${testimonial.content}"</p>
                <p class="author">- ${testimonial.author}</p>
                <p class="author"><i class="fas fa-star"></i>${testimonial.star}</p>
            </div>`
    })
    
    document.getElementById("testimonials").innerHTML = testimonialHTML.join("")
  }
  
async function getTestimonialByStar(star) {
    const testimonials = await fetchTestimonials()

    const filteredTestimonials = testimonials.filter((testimonial) => {
      return testimonial.star === star
    })
  
    const testimonialHTML = filteredTestimonials.map((testimonial) => {
      return `<div class="testimonial">
                <img src="${testimonial.image}" class="profile-testimonial" />
                <p class="quote">"${testimonial.content}"</p>
                <p class="author">- ${testimonial.author}</p>
                <p class="author"><i class="fas fa-star"></i>${testimonial.star}</p>
            </div>`
    })
    
    document.getElementById("testimonials").innerHTML = testimonialHTML.join("")
  }
  
  getAllTestimonials()