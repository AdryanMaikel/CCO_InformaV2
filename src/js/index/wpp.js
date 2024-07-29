const div_wpp = document.querySelector("#wpp");

document.querySelector("#open-cco-wpp").addEventListener("click", function(){
    if(section.querySelector(".container.open")
    || form_login.classList.contains("open")){
        return;
    }
    div_wpp.classList.add("open");

});

document.querySelector("#close-wpp").addEventListener("click", function(){
    div_wpp.classList.remove("open");
});