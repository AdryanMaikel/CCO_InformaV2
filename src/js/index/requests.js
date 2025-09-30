const section = document.querySelector("section");

function create_script(src){
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    document.head.appendChild(script);
    script.onload = function(){console.log(src, " carregado.")}
}
async function request(route, method, json, return_text = false, return_json = false, alertOnError = false) {
  const url = `/${route}/${operator.value}/${password.value}`;

  // GET
  if (method == "GET") {
    const response = await fetch(url);

    if (response.status != 200) {
      if (alertOnError) {
        let msg;
        try { msg = await response.text(); } catch { msg = ""; }
        window.alert(msg?.trim() ? msg : `Erro ${response.status}`);
      }
      return;
    }

    if (return_json) {
      const response_json = await response.json();
      return response_json;
    }
    const response_text = await response.text();
    return response_text;
  }

  // POST/PUT/DELETE
  const response = await fetch(url, {
    method: method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(json)
  });

  if (!return_text) {
    // comportamento antigo: devolve boolean
    if (!response.ok && alertOnError) {
      let msg;
      try { msg = await response.text(); } catch { msg = ""; }
      window.alert(msg?.trim() ? msg : `Erro ${response.status}`);
    }
    return response.ok;
  } else {
    // comportamento antigo: devolve texto só em sucesso
    if (response.ok) {
      return await response.text();
    } else {
      if (alertOnError) {
        let msg;
        try { msg = await response.text(); } catch { msg = ""; }
        window.alert(msg?.trim() ? msg : `Erro ${response.status}`);
      }
      return;
    }
  }
}

async function load_containers(){
    const scripts = await request("scripts", "GET");
    if (!scripts) return;
    scripts.split(",").forEach(src => create_script(src));
}
