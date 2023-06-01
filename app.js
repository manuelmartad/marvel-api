const formulario = document.querySelector("#formulario");
const resultado = document.querySelector("#resultado");

window.addEventListener("load", () => {
  formulario.addEventListener("submit", buscarPersonaje);
});

function buscarPersonaje(e) {
  e.preventDefault();
  // validaciones
  const personaje = document.querySelector("#personaje").value;

  if (personaje === "") {
    mostrarError("El nombre del personaje es obligatorio");
    //   se usa return para detener el script
    return;
  }

  //   consultar API
  consultarAPI(personaje);
}

function consultarAPI(personaje) {
  const hash = "c44425fe59937b963a2bdbbbdff27458";
  const publicKey = "5e661a59ce1040adac67d6d8bb19dcdd";
  const url = `https://gateway.marvel.com:443/v1/public/characters?name=${personaje}&ts=1&apikey=${publicKey}&hash=${hash}&limit=100
  `;
  Spinner();

  setTimeout(() => {
    fetch(url)
      .then((respuesta) => respuesta.json())
      .then((datos) => {
        limpiarHTML();
        console.log(datos.data);
        if (datos.data.results.length === 0) {
          mostrarError("Este personaje no existe!");
        }

        // mostrar respuesta en HTML
        mostrarDatos(datos);
      });
  }, 2500);
  formulario.reset();
}

function mostrarDatos(datos) {
  // destructurando el objeto
  const {
    data: { results },
  } = datos;

  const nombre = document.createElement("P");
  nombre.innerHTML = `<h2>${results[0].name}</h2>`;
  nombre.classList.add("p-1");
  resultado.appendChild(nombre);

  console.log(results[0].thumbnail);
  const img = document.createElement("img");
  img.src = `${results[0].thumbnail.path}.jpg`;
  img.classList.add("w-75", "mb-3");
  resultado.appendChild(img);

  const description = document.createElement("P");
  description.innerHTML = `<h5>${results[0].description}</h5>`;
  description.classList.add("p-1", "text-justify");
  resultado.appendChild(description);

  results[0].urls.forEach((ele) => {
    const series = document.createElement("P");
    series.innerHTML = `<i>${ele.type}</i>`;
    series.classList.add("p-1");
    resultado.appendChild(series);

    const resource = document.createElement("p");
    resource.innerHTML = `<a href="${ele.url}">${ele.url}</a>`;
    series.classList.add("p-1");
    series.appendChild(resource);
  });
}

function mostrarError(mensaje) {
  // seleccionar la clase bg-danger porque en ella nos vamos a basar para validar si ya existe la alerta
  const alert = document.querySelector(".bg-danger");
  // si la alerta no existe entonces se crea
  if (!alert) {
    // crear alerta
    const alert = document.createElement("DIV");
    // agregar clases
    alert.classList.add(
      "bg-danger",
      "p-3",
      "text-center",
      "mt-1",
      "text-uppercase"
    );
    // crear html
    alert.innerHTML = `<strong>Error!</strong>
  <span>${mensaje}</span>`;

    // agregar como child al formulario (quedaria debajo del boton ya que es el ultimo child del #formulario)
    formulario.appendChild(alert);

    // se elimine la alerta despues de 3 seg
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function limpiarHTML() {
  while (resultado.firstChild) {
    resultado.removeChild(resultado.firstChild);
  }
}

function Spinner() {
  limpiarHTML();
  const divSpinner = document.createElement("DIV");
  divSpinner.classList.add("sk-folding-cube");
  divSpinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
    `;

  resultado.appendChild(divSpinner);
}
