// ======================================================
// MOTOR · ABUELA TATA COMUNIÓN 2027
// ======================================================

window.MotorAbuelaTataComunion = {
  id: "abuela-tata-comunion",

  normalizarLinea(linea) {

    let suplemento = 0;

    if (
      linea.cuerpoFalda === true &&
      linea.tallaCuerpo &&
      linea.tallaFalda &&
      linea.tallaCuerpo !== linea.tallaFalda
    ) {
      suplemento = 20;
    }

    return {
      referencia: linea.referencia,
      nombre: linea.nombre,
      tipo: linea.tipo,

      cantidad: linea.cantidad || 1,

      talla: linea.talla || null,

      tallaCuerpo: linea.tallaCuerpo || null,
      tallaFalda: linea.tallaFalda || null,

      cuerpoFalda: linea.cuerpoFalda || false,

      precio: Number(linea.precio || 0),

      suplemento
    };
  },

  validarPedido(carrito) {

    if (!carrito.length) {
      return {
        valido: false,
        mensaje: "El carrito está vacío."
      };
    }

    return {
      valido: true,
      mensaje: "Pedido válido."
    };
  }
};
