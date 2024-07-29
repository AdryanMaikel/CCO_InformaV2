const div_config = document.querySelector("#config");

document.querySelector("#open-config").addEventListener("click", function(){
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")){
        return;
    }
    div_config.classList.add("open");

});

document.querySelector("#close-config").addEventListener("click", function(){
    div_config.classList.remove("open");
})