let photos = ['img/pic.gif', 'img/pic1.jpg', 'img/pic2.jpg', 'img/pic3.gif', 'img/pic10.jpg', 'img/pic4.jpg', 'img/pic5.png', 'img/pic6.jpg', 'img/pic11.jpg', 'img/pic7.gif', 'img/pic9.jpg', 'img/pic8.jpg'];
let deletedPhotos = [];
localStorage.setItem('start', "");

document.onkeydown = checkKey;

function checkKey(e) {

    x = +localStorage.getItem('key'); // + vor dem localStorage

    e = e || window.event;

    if (e.keyCode == '37') {
        // left arrow
        renderFullscreen(x - 1);
    }

    if (e.keyCode == '39') {
        // right arrow
        renderFullscreen(x + 1);
    }
}

function renderFullscreen(x) {
    if (x == photos.length) {
        x = 0;
        renderFullscreen(x);
    }

    if (x == -1) {
        x = photos.length - 1;
        renderFullscreen(x);
    }

    let content = document.getElementById('fullscreen');
    content.innerHTML = "";
    const photo = photos[x];
    if (x < photos.length, x > -1) {
        content.innerHTML += `
        <div class="div-fullscreen">
        <div onclick="renderFullscreen(${x - 1})" class="click-next" onmouseover="icons('left')" onmouseleave="icons('lHide')"><img id="left" class="display-none" src="img/left.png"></div>
        <img onclick="overlay(x, 'fullscreenOff')" src="${photo}">
        <div onclick="renderFullscreen(${x + 1})" class="click-next" onmouseover="icons('right')" onmouseleave="icons('rHide')"><img id="right" class="display-none" src="img/right.png"></div>
        </div>
        <div class="diashow"><img id="play" onclick="powerUp()" src="img/play.png"></div>
        `;
    }

    if (localStorage.getItem('start') == "Go") {
        document.getElementById('play').setAttribute('src', 'img/play-black.png');
    }
    if (localStorage.getItem('start') == "Stop") {
        document.getElementById('play').setAttribute('src', 'img/play.png');
    }

    localStorage.setItem('key', x);
}

function powerUp() {
    if (localStorage.getItem('start') == "Go") {
        localStorage.setItem('start', "Stop");
        document.getElementById('play').setAttribute('src', 'img/play.png');
    } else {
        localStorage.setItem('start', "Go");
        diashow();
        document.getElementById('play').setAttribute('src', 'img/play-black.png');
    }
}

function diashow() {
    if (localStorage.getItem('start') == "Go") {
        setTimeout(diashow2, 5000);
    } else {
        localStorage.setItem('start', "Stop")
    }
}

function diashow2() {
    let x = +localStorage.getItem('key');
    renderFullscreen(x + 1);
    diashow();
}

function icons(x) {
    if (x == "left") {
        document.getElementById('left').classList.remove('display-none');
    }

    if (x == "lHide") {
        document.getElementById('left').classList.add('display-none');
    }

    if (x == "right") {
        document.getElementById('right').classList.remove('display-none');
    }

    if (x == "rHide") {
        document.getElementById('right').classList.add('display-none');
    }
}

function ini() {
    loadMenu();
    loadImgs();
    renderPhotos();
}

function back() {
    switchMenu('on');
    renderPhotos();
}

function renderPhotos() {
    content = document.getElementById('content');
    content.innerHTML = '';
    for (x = 0; x < photos.length; x++) {
        const photo = photos[x]; // hier ist wichtig dass in mouseover="function(hier nicht dieser: "" String verwendet werdet wird sondern in diesem Fall: '')"
        content.innerHTML += `
        <div id="${x}" onmouseover="overlay(${x}, 'show')" onmouseleave="overlay(${x}, 'hide')" class="img-div cursor-pointer">
        <img src="${photo}">
        <div onclick="fullscreen(${x}, 'fullscreen')" id="${x + 'overlay'}" class="overlay display-none"></div>
        <button id="${x + 'button'}" onclick="deleteImg(${x}, 'keep')" class="delete display-none">X</button>
        </div>
        `;
    }
    changeIcon('photo-color');
    changeIcon('bin');
}

function deleteImg(x, y) {
    if (y == 'keep') {
        deletedPhotos.unshift(photos[x]);
        photos.splice(x, 1);

        renderPhotos();
    }

    if (y == 'destroy') {
        deletedPhotos.splice(x, 1);

        renderDeletedPhotos();
    }

    saveImgs();
    loadImgs();
}

function saveImgs() {
    let x = JSON.stringify(photos);
    localStorage.setItem('photos', x);

    let y = JSON.stringify(deletedPhotos);
    localStorage.setItem('deletedPhotos', y);
}

function loadImgs() {
    if (localStorage.getItem('photos')) {
        let x = localStorage.getItem('photos');
        photos = JSON.parse(x);
    }

    if (localStorage.getItem('deletedPhotos')) {
        let x = localStorage.getItem('deletedPhotos');
        deletedPhotos = JSON.parse(x);
    }
}

function overlay(x, y) {
    if (y == "show") {
        document.getElementById(x + "overlay").classList.remove('display-none');
        document.getElementById(x + "button").classList.remove('display-none');
    }

    if (y == "hide") {
        document.getElementById(x + "overlay").classList.add('display-none');
        document.getElementById(x + "button").classList.add('display-none');
    }

    if (y == "fullscreen") {
        document.getElementById("fullscreen").classList.remove('display-none');
        document.getElementById("body").classList.add('disable-scrolling');
        setTimeout(function bG() { document.getElementById("fullscreen").classList.add('background') }, 225); // Anonyme - Funktion, setTimeout funktioniert nur mit Funktionen
    }

    if (y == "fullscreenOff") {
        document.getElementById("fullscreen").classList.add('display-none');
        document.getElementById("body").classList.remove('disable-scrolling');
        document.getElementById("fullscreen").classList.remove('background');
        localStorage.setItem('start', "");
    }
}

function fullscreen(x, y) {
    overlay(x, y);
    renderFullscreen(x);
}

function renderDeletedPhotos() {
    content = document.getElementById('content');
    content.innerHTML = '';
    for (x = 0; x < deletedPhotos.length; x++) {
        const photo = deletedPhotos[x];
        content.innerHTML += `
        <div onmouseover="overlay(${x}, 'show')" onmouseleave="overlay(${x}, 'hide')" class="img-div cursor-pointer">
        <img src="${photo}">
        <div onclick="restore(${x})" id="${x + 'overlay'}" class="overlay display-none"></div>
        <button id="${x + 'button'}" onclick="deleteImg(${x}, 'destroy')" class="delete display-none">X</button>
        </div>
        `;
    }
    changeIcon('bin-color');
    changeIcon('photo');
}

function restore(x) {
    photos.unshift(deletedPhotos[x]); // push adds to the end of an array, unshift adds to the start of an array
    deletedPhotos.splice(x, 1);

    renderDeletedPhotos();
}

function addImg() {
    let x = document.getElementById('input');
    if (x.value.indexOf('h') == 0 && x.value.indexOf('s') == 4) {
        photos.unshift(x.value);
        x.value = "";

        saveImgs();
        loadImgs();
        renderPhotos();
    }

    else {
        x.value = "";
    }
}

function switchMenu(x) {
    if (x == 'off') {
        document.getElementById('off').classList.add('display-none');
        document.getElementById('on').classList.remove('display-none');
    }

    if (x == 'on') {
        document.getElementById('on').classList.add('display-none');
        document.getElementById('off').classList.remove('display-none');
    }

    saveMenu(x);
}

function changeIcon(x) {
    if (x == 'back') {
        document.getElementById('backIcon').setAttribute('src', 'img/back.png');
    }

    if (x == 'back-black') {
        document.getElementById('backIcon').setAttribute('src', 'img/back-black.png');
    }

    if (x == 'bin') {
        document.getElementById('binIcon').setAttribute('src', 'img/bin.png');
    }

    if (x == 'bin-color') {
        document.getElementById('binIcon').setAttribute('src', 'img/bin-color.png');
    }

    if (x == 'photo') {
        document.getElementById('photoIcon').setAttribute('src', 'img/photo.png');
    }

    if (x == 'photo-color') {
        document.getElementById('photoIcon').setAttribute('src', 'img/photo-color.png');
    }

    if (x == 'plus-color') {
        document.getElementById('plus').setAttribute('src', 'img/plus-color.png');
    }

    if (x == 'plus') {
        document.getElementById('plus').setAttribute('src', 'img/plus.png');
    }
}

function saveMenu(x) {
    localStorage.setItem('Menu', x);
}

function loadMenu() {
    let value = localStorage.getItem('Menu');
    switchMenu(value);
}