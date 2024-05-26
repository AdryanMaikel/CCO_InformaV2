const width_columns_default = {_: 35,A: 90,B: 80,C: 55,D: 55,E: 92,F: 55,G: 70,H: 325,I: 250,J: 400,K: 80, sum: 0};
function create_cookie_width_columns(){
    const width_columns = JSON.stringify(width_columns_default);
    document.cookie=`columns=${width_columns}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
    return JSON.parse(decodeURIComponent(width_columns));
}
function update_cookie_width_columns(new_width_columns){
    document.cookie=`columns=${JSON.stringify(new_width_columns)}; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/`;
};
const width_columns = document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns="))
?JSON.parse(decodeURIComponent(document.cookie.split(";").find(cookie=>cookie.trim().startsWith("columns=")).split("=")[1]))
:create_cookie_width_columns();

export { width_columns, update_cookie_width_columns }