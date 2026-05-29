console.log("Plantilla Abuela Tata Comunión cargada correctamente.");

window.PlantillasPedido = window.PlantillasPedido || {};

window.PlantillasPedido.abuela_tata_comunion = {
  id: "abuela_tata_comunion",
  nombre: "Abuela Tata · Comunión",
  tipo: "vestidos_comunion",

  inicializar: function (coleccion) {
    console.log("Inicializando plantilla Abuela Tata Comunión:", coleccion);
  }
};
