function submitData(){
    const inputName = document.getElementById("inputName").value
    const inputEmail = document.getElementById("inputEmail").value
    const inputPhone = document.getElementById("inputPhone").value
    const inputSubject = document.getElementById("inputSubject").value
    const inputMessage = document.getElementById("inputMessage").value

    if (inputName == ""){
        alert("Nama Harus Diisi")
    }
    else if(inputEmail == ""){
        alert("Email Harus Diisi")
    }
    else if (inputPhone == ""){
        alert("Phone Number Harus Diisi")
    }
    else if (inputSubject == ""){
        alert("Subject Harus Diisi")
    }
    else if (inputMessage == ""){
        alert("Message Harus Diisi")
    }
    else{
        alert("Terima Kasih telah memberikan pesan")
    }

    console.log(
    `Name : ${inputName}\n Email : ${inputEmail}\n Phone : ${inputPhone}\n Subject : ${inputSubject}\n Message : ${inputMessage}`
    );
  
    const myemail = "mujahaq@gmail.com";
    let a = document.createElement("a");
    a.href = `mailto:${myemail}?subject=${inputSubject}&body=Hello my name ${inputName}, and my number ${inputPhone} ${inputMessage}`;
    a.click();
}
