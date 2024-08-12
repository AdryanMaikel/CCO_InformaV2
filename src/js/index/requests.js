function create_script(src){
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);

    script.onload = function(){console.log(src, " carregado.")}
}

async function load_containers(){
    const response = await fetch(`/scripts/${operator.value}/${password.value}`);
    if(response.status != 200)return;
    (await response.json()).forEach(src=>create_script(src))
}
