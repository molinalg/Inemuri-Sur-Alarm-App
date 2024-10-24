// Creación del mapa
const mymap = L.map('map');
// Arrays para almacenar los marcadores y círculos de la posición del usuario
let markers = [];
let circles = [];
// Destino (valor y array para almacenar el marcador)
let destino = [0,0];
let destinos = [];
// Valores de la posición del usuario
let latitude, longitude = 0;

// Lista de paradas y sus coordenadas.
var paradas = [, 
  { parada: "Arroyo Culebro", latitud: 40.289095340349625, longitud: -3.7565622566639436 },
  { parada: "Alonso De Mendoza", latitud: 40.30082189425275, longitud: -3.7364337374199623 },
  { parada: "Juan De La Cierva", latitud: 40.31182516606424, longitud: -3.722464902068397 },
  { parada: "Los Espartales", latitud: 40.32446214683173, longitud: -3.7179788983808453 },
  { parada: "El Carrascal", latitud: 40.336828763099, longitud: -3.7398021100325423 },
  { parada: "Casa Del Reloj", latitud: 40.32671087007814, longitud: -3.7594343702092416 },
  { parada: "Leganés Central", latitud: 40.32897650023322, longitud: -3.7709678683617285 },
  { parada: "Puerta Del Sur", latitud: 40.34544442031128, longitud: -3.8121432174068586 },
  { parada: "Alcorcón Central", latitud: 40.35042179052055, longitud: -3.8315142407106824 },
  { parada: "Universidad Rey Juan Carlos", latitud: 40.33492817583654, longitud: -3.8721539885722716 },
  { parada: "Pradillo", latitud: 40.321754517524944, longitud: -3.8645044983809305 },
  { parada: "Manuela Malasaña", latitud: 40.30917724531274, longitud: -3.863826883041989 },
  { parada: "Hospital De Fuenlabrada", latitud: 40.28580788497336, longitud: -3.8165902020689555 },
  { parada: "Fuenlabrada Central", latitud: 40.28278538874582, longitud: -3.7986491394586936 }
];

// Comprobación constante de la localización del usuario y seguimiento
if('geolocation' in navigator){
  const watchID = navigator.geolocation.watchPosition((position) => {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      locateMap(latitude,longitude);
      calcularDistancia();
    });
}

// Función para posicionar el mapa en el usuario y marcar su posición con marcador y círculo
function locateMap(latitude,longitude){
  mymap.setView([latitude, longitude], 16);

  borrarPuntos();

  const marker = L.marker([latitude, longitude]).bindPopup(latitude.toString() + ", " + longitude.toString()).addTo(mymap);
  markers.push(marker);

  const circle = L.circle([latitude, longitude], {
    radius: 500,
    color: "#00304E"}).addTo(mymap);
  circles.push(circle);
}

// Función para borrar los marcadores y círculos de la posición del usuario
function borrarPuntos(){
  markers.forEach((marker) => {
    marker.removeFrom(mymap);
  });
  circles.forEach((circle) => {
    circle.removeFrom(mymap);
  });
  markers = [];
  circles = [];
}

// Función para calcular la distancia entre el usuario y el destino
function calcularDistancia(){
  if (destino[0] != 0 && destino[1] != 0) {
    const distancia = L.latLng(latitude, longitude).distanceTo(destino);
    var alarma = document.getElementById("alarma");
    if (distancia < 500 && alarma.src.includes("sleep.png")) {
      alarma.src = "images/pause.png";
      window.navigator.vibrate([1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 1000, 500, 2000]);
    } else if (distancia > 500) {
      window.navigator.vibrate(0);
    }
  }
}

// Función para fijar el destino
function fijarDestino(){
  let valor = document.getElementById("parada").value;
  paradas.forEach((elemento) => {
    if (elemento.parada == valor) {
      destino = [elemento.latitud, elemento.longitud];
    }
  });
  marcarDestino();
  document.getElementById("alarma").src = "images/sleep.png";
  calcularDistancia();
}

// Función para marcar el destino
function marcarDestino(){
  const markerDestino = L.marker(destino).bindPopup(destino.toString()).addTo(mymap);
  borrarDestinos();
  destinos.push(markerDestino);
}

// Función para borrar el destino del mapa
function borrarDestinos(){
  destinos.forEach((destino) => {
    destino.removeFrom(mymap);
  });
  destinos = [];
}

// Función para parar la vibración de la alarma
function apagar(){
  var alarma = document.getElementById("alarma");
  if (alarma.src.includes("pause.png")) {
    window.navigator.vibrate(0);
    alarma.src = "images/off.png";
    borrarDestinos();
  }
}

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>',
  maxZoom: 18
}).addTo(mymap);

// Lector de evento click para apagar la vibración de la alarma
mymap.on('click', function() {
  apagar();
} );
