// ======================================================
// PEDIDO CORE · ÁREA PROFESIONAL B2B
// Núcleo común para todas las campañas
// ======================================================

window.PedidoCore = (() => {
  let carrito = [];
  let campaniaActual = null;
  let motorActual = null;

  function inicializar({ campania, motor }) {
    campaniaActual = campania;
    motorActual = motor;
    carrito = [];

    console.log("PedidoCore iniciado:", {
      campania: campaniaActual?.id,
      motor: motorActual?.id
    });
  }

  function obtenerCarrito() {
    return carrito;
  }

  function vaciarCarrito() {
    carrito = [];
    notificarCambio();
  }

  function agregarLinea(linea) {
    if (!motorActual) {
      throw new Error("No hay motor de pedido cargado.");
    }

    const lineaNormalizada = motorActual.normalizarLinea(linea);

    carrito.push({
      id: generarIdLinea(),
      ...lineaNormalizada
    });

    notificarCambio();
  }

  function eliminarLinea(idLinea) {
    carrito = carrito.filter(linea => linea.id !== idLinea);
    notificarCambio();
  }

  function actualizarCantidad(idLinea, nuevaCantidad) {
    carrito = carrito.map(linea => {
      if (linea.id !== idLinea) return linea;

      return {
        ...linea,
        cantidad: Number(nuevaCantidad) || 0
      };
    });

    notificarCambio();
  }

  function calcularTotales() {
    let subtotal = 0;
    let suplementos = 0;

    carrito.forEach(linea => {
      const cantidad = Number(linea.cantidad) || 0;
      const precio = Number(linea.precio) || 0;
      const suplemento = Number(linea.suplemento) || 0;

      subtotal += cantidad * precio;
      suplementos += cantidad * suplemento;
    });

    return {
      subtotal,
      suplementos,
      total: subtotal + suplementos
    };
  }

  function prepararPedido() {
    if (!campaniaActual) {
      throw new Error("No hay campaña activa.");
    }

    if (!motorActual) {
      throw new Error("No hay motor activo.");
    }

    const totales = calcularTotales();

    return {
      campaniaId: campaniaActual.id,
      campaniaNombre: campaniaActual.nombre,
      motorId: motorActual.id,
      fecha: new Date().toISOString(),
      lineas: carrito,
      totales
    };
  }

  function validarPedido() {
    if (!carrito.length) {
      return {
        valido: false,
        mensaje: "El carrito está vacío."
      };
    }

    if (!motorActual?.validarPedido) {
      return {
        valido: true,
        mensaje: "Pedido válido."
      };
    }

    return motorActual.validarPedido(carrito);
  }

  function notificarCambio() {
    window.dispatchEvent(
      new CustomEvent("pedido:carritoActualizado", {
        detail: {
          carrito,
          totales: calcularTotales()
        }
      })
    );
  }

  function generarIdLinea() {
    return `linea_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  return {
    inicializar,
    obtenerCarrito,
    vaciarCarrito,
    agregarLinea,
    eliminarLinea,
    actualizarCantidad,
    calcularTotales,
    prepararPedido,
    validarPedido
  };
})();
