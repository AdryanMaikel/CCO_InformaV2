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