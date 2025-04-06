var urlParameter = [];
u = location.search.replace("?", "").split("&").forEach(function(d) {
    e = d.split("=");
    urlParameter[e[0]] = e[1]
})

document.getElementById("URLS").innerHTML = atob(urlParameter.URLS);
document.getElementById("TITLE").innerHTML = atob(urlParameter.MSG);
document.getElementById("MSG").innerHTML = atob(urlParameter.MSG);
document.getElementById("MSG2").innerHTML = atob(urlParameter.MSG2);

