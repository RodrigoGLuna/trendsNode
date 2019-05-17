var selectPaises = document.getElementById("paises");



var request = new XMLHttpRequest();
request.open('GET', 'https://api.mercadolibre.com/sites', true);
request.onload = function () {

    // Begin accessing JSON data here
    var data = JSON.parse(this.response);
    if (request.status >= 200 && request.status < 400) {
        data.forEach(site => {
        const option = document.createElement("option");
        option.text = site.name;
        option.setAttribute("value",site.id);
        selectPaises.add(option);
    });
    } else {
        const errorMessage = document.createElement('marquee');
        errorMessage.textContent = "No funciona!";
        app.appendChild(errorMessage);
    }
}

request.send();

var selectCategorias =  document.getElementById("categorias");
selectPaises.addEventListener("change",cargarCategorias);
function cargarCategorias() {
    document.getElementById('categorias').innerText="";
    var length = selectCategorias.options.length;
    for (i = 0; i < length; i++) {
        selectCategorias.options[i] = null;
    }

    var idPaisSelec= selectPaises.options[selectPaises.selectedIndex].value;
    var request = new XMLHttpRequest();
    request.open('GET', 'https://api.mercadolibre.com/sites/'+idPaisSelec+'/categories', true);
    request.onload = function () {
        const option = document.createElement("option");
        option.text = "-----Sin categoria-----";
        option.setAttribute("value","sin");
        selectCategorias.add(option);
        // Begin accessing JSON data here
        var data = JSON.parse(this.response);
        if (request.status >= 200 && request.status < 400) {
            data.forEach(categoria => {
                const option = document.createElement("option");
                option.text = categoria.name;
                option.setAttribute("value",categoria.id);
                selectCategorias.add(option);
            });
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = "No funciona!";
            app.appendChild(errorMessage);
        }
    }

    request.send();
}




