// ======================================================
// PEDIDOS · COORDINADOR GENERAL
// Conecta plantilla + motor + PedidoCore
// ======================================================

window.PedidosApp = (() => {
  const motores = {
    "abuela_tata_comunion": window.MotorAbuelaTataComunion,
    "navy_blue_comunion": window.MotorNavyBlueComunion,
    "abuela_tata_ceremonia": window.MotorAbuelaTataCeremonia,
    "abuela_tata_verano": window.MotorAbuelaTataVerano
  };

  function obtenerMotor(plantilla) {
    return motores[plantilla] || null;
  }

  function inicializar({ coleccion, plantilla }) {
    const motor = obtenerMotor(plantilla);

    if (!motor) {
      console.error("No se encontró motor para la plantilla:", plantilla);
      return;
    }

    if (!window.PedidoCore) {
      console.error("PedidoCore no está cargado.");
      return;
    }

    window.PedidoCore.inicializar({
      campania: {
        id: coleccion,
        nombre: coleccion
      },
      motor
    });

    console.log("PedidosApp inicializada:", {
      coleccion,
      plantilla,
      motor: motor.id
    });
  }

  function agregarProducto(linea) {
    window.PedidoCore.agregarLinea(linea);
  }

  function obtenerCarrito() {
    return window.PedidoCore.obtenerCarrito();
  }

  function calcularTotales() {
    return window.PedidoCore.calcularTotales();
  }

  return {
    inicializar,
    agregarProducto,
    obtenerCarrito,
    calcularTotales
  };
})();
