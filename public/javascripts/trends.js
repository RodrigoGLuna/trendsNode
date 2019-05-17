const urlParams = new URLSearchParams(window.location.search);
const pais=urlParams.get('paisSel');
const categoria=urlParams.get('categoriaSel');
const filas=urlParams.get('filasSel');
const columnas=urlParams.get('columnasSel');
const opcion=urlParams.get('opcionSel');


var array = [];
var request = new XMLHttpRequest();
if (categoria=="sin") {
    request.open('GET', 'https://api.mercadolibre.com/trends/' + pais, true);
}else {
    request.open('GET', 'https://api.mercadolibre.com/trends/'+ pais+'/'+categoria, true);
}
    request.onload = function () {

        // Begin accessing JSON data here
        var data = JSON.parse(this.response);

        if (request.status >= 200 && request.status < 400) {
            for (var i=0;i<data.length;i++){
                array[i] = data[i];
            }
        } else {
            const errorMessage = document.createElement('marquee');
            errorMessage.textContent = "No funciona!";
            app.appendChild(errorMessage);
        }
    };

    request.send();


var container = document.body;

// slide options
var slideEase = function(t) {
        return t * t * t;
    },
    slideDuration = 1000;

// text options
var delay = {
    before: 300,
    between: 200,
    after: 2500
};

// trends snapshot (can't think of a JS only way to load these dynamically)
var trends =  array;
function randomTrend() {
    return trends[Math.floor(trends.length * Math.random())];
}

// colors
var colors = ['#ff3031', '#68ac0d', '#00a8da', '#fbc500'];
function randomColor() {
    return colors[Math.floor(colors.length * Math.random())];
}

var Cell = function(x, y) {
    // create the node
    var node = document.createElement('div');
    node.className = 'cell';
    node.style.left = x * (100/columnas) + '%';
    node.style.width= (100/columnas) + '%';
    node.style.height=(100/filas) + '%';
    node.style.top  = y *(100/filas) + '%';
    this.node = node;

    // create and add the panes
    var panes = [new Pane(this), new Pane(this)];
    node.appendChild(panes[0].node);
    node.appendChild(panes[1].node);
    panes[0].setOtherNode(panes[1].node);
    panes[1].setOtherNode(panes[0].node);

    // handles sliding in next pane
    var currentPane = 0;
    this.nextPane = function() {
        // swap z-indexes
        panes[currentPane].node.style.zIndex = '-1';
        currentPane = ++currentPane % 2;
        panes[currentPane].node.style.zIndex = '1';

        panes[currentPane].init();
    }

    // quickstart
    panes[0].quickStart();
    panes[0].node.style.zIndex = '1';
}

var Pane = function(cell) {
    var otherNode;
    this.setOtherNode = function(other) {
        otherNode = other;
    }

    // create the node
    var node = document.createElement('div');
    node.className = 'pane';
    this.node = node;

    // a place to write the trends
    var trend = document.createElement('a');
    trend.className = 'trend';
    node.appendChild(trend);

    // (re-)initialize pane when sliding in
    this.init = function() {
        var dir = Math.floor(4 * Math.random());
        switch (dir) {
            case 0:
                slideStart = {left:0,top:-100};
                break;
            case 1:
                slideStart = {left:100,top:0};
                break;
            case 2:
                slideStart = {left:0,top:100};
                break;
            case 3:
                slideStart = {left:-100,top:0};
                break;
        }
        // make sure it's a different background color
        do
            node.style.backgroundColor = randomColor();
        while (node.style.backgroundColor == otherNode.style.backgroundColor);

        var trendObjeto = randomTrend();
        trend.title=trendObjeto.keyword
        trend.href = trendObjeto.url;
        trend.innerHTML = '';

        // start sliding in
        slideValue = 0;
        slideIn();
    }

    // handles sliding in
    var slideStart,
        slideValue;
    var slideIn = function() {
        slideValue += 20 / slideDuration;
        if (slideValue >= 1) {
            // end of sliding in
            slideValue = 1;
            setTimeout(nextChar, delay.before);
        } else {
            setTimeout(slideIn, 20);
        }
        node.style.left = slideEase(1 - slideValue) * slideStart.left + '%';
        node.style.top  = slideEase(1 - slideValue) * slideStart.top  + '%';
        // push other node away
        otherNode.style.left =
            (slideEase(1 - slideValue) - 1) * slideStart.left + '%';
        otherNode.style.top  =
            (slideEase(1 - slideValue) - 1) * slideStart.top  + '%';
    }

    // handles text
    var nextChar = function() {
        if (trend.innerHTML.length < trend.title.length) {
            trend.innerHTML =
                trend.title.slice(0, trend.innerHTML.length + 1);
            setTimeout(nextChar, delay.between);
        } else {
            setTimeout(cell.nextPane, delay.after);
        }
    }

    // initial start
    this.quickStart = function() {
        node.style.backgroundColor = colors[3];
        trend.title = "¡Bienvenido!"
        nextChar();
    }
}

// create the cells
var cells = [];
for (var i = 0; i < (filas * columnas); i++) {
    cells[i] = new Cell(i % columnas, Math.floor(i / columnas));
    container.appendChild(cells[i].node);
}

// handles font size on resize
// quick and dirty, needs a fix
function calcFontsize() {
    var fontSize = Math.min(
        container.clientHeight / 18,
        container.clientWidth / 46
    );
    fontSize = Math.floor(fontSize);
    container.style.fontSize = fontSize + 'px';
}
calcFontsize();
window.onresize = calcFontsize;









