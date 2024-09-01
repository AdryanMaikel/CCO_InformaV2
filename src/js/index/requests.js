const section = document.querySelector("section");

function create_script(src){
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = function(){console.log(src, " carregado.")}
}
async function request(route, method, json) {
    if(method == "GET") {
        const response = await fetch(`/${route}/${operator.value}/${password.value}`);
        if(response.status != 200)return;
        const response_text = await response.text();
        return response_text;
    }
    const response = await fetch(
        `/${route}/${operator.value}/${password.value}`,
        {
            method: method,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(json)
        }
    );
    return response.ok
}
async function load_containers(){
    const scripts = await request("scripts", "GET");
    if (!scripts) return;
    scripts.split(",").forEach(src => create_script(src));
}
