console.log("Área Profesional B2B · Abuela Tata cargada correctamente.");

const SUPABASE_URL = "https://qoyrjhgjtydbcngfnyqn.supabase.co";

const SUPABASE_ANON_KEY =
"TU_SUPABASE_ANON_KEY";

const splash = document.getElementById("splash");
const authView = document.getElementById("authView");
const app = document.getElementById("app");

const installBtn = document.getElementById("installBtn");
const installHint = document.getElementById("installHint");

const languageSelect = document.getElementById("languageSelect");

const logoutBtn = document.getElementById("logoutBtn");

const userBadge = document.getElementById("userBadge");
const userEmail = document.getElementById("userEmail");

const authMessage = document.getElementById("authMessage");

const tabLogin = document.getElementById("tabLogin");
const tabReset = document.getElementById("tabReset");
const tabUpdate = document.getElementById("tabUpdate");

const loginForm = document.getElementById("loginForm");
const resetForm = document.getElementById("resetForm");
const updateForm = document.getElementById("updateForm");

const goToReset = document.getElementById("goToReset");
const backToLogin = document.getElementById("backToLogin");

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const resetEmail = document.getElementById("resetEmail");

const newPassword = document.getElementById("newPassword");
const confirmPassword = document.getElementById("confirmPassword");

const openOrdersBtn = document.getElementById("openOrdersBtn");
const closeOrdersBtn = document.getElementById("closeOrdersBtn");
const refreshOrdersBtn = document.getElementById("refreshOrdersBtn");

const ordersPanel = document.getElementById("ordersPanel");
const ordersLoading = document.getElementById("ordersLoading");
const ordersEmpty = document.getElementById("ordersEmpty");
const ordersList = document.getElementById("ordersList");

const avisosBtn = document.getElementById("avisosBtn");
const avisosPanel = document.getElementById("avisosPanel");
const cerrarAvisosBtn = document.getElementById("cerrarAvisosBtn");

let deferredPrompt = null;
let currentSession = null;

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);

function showMessage(text, type = "error") {

  if (!authMessage) return;

  authMessage.className = "message show " + type;
  authMessage.textContent = text;
}

function clearMessage() {

  if (!authMessage) return;

  authMessage.className = "message";
  authMessage.textContent = "";
}

function setActiveForm(name) {

  [loginForm, resetForm, updateForm].forEach(form => {
    if (form) form.classList.remove("active");
  });

  [tabLogin, tabReset, tabUpdate].forEach(tab => {
    if (tab) tab.classList.remove("active");
  });

  if (name === "login") {

    loginForm.classList.add("active");
    tabLogin.classList.add("active");

  } else if (name === "reset") {

    resetForm.classList.add("active");
    tabReset.classList.add("active");

  } else if (name === "update") {

    updateForm.classList.add("active");
    tabUpdate.style.display = "inline-flex";
    tabUpdate.classList.add("active");
  }
}

function showAuthView() {

  authView.style.display = "block";
  app.style.display = "none";
}

function showAppView(session) {

  authView.style.display = "none";
  app.style.display = "block";

  currentSession = session;

  if (
    session &&
    session.user &&
    session.user.email
  ) {

    userEmail.textContent =
      "Sesión: " + session.user.email;

    userBadge.classList.add("show");
  }
}

async function checkSession() {

  try {

    const {
      data,
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error(error);
      showAuthView();
      return;
    }

    if (data.session) {

      showAppView(data.session);

    } else {

      showAuthView();
    }

  } catch (err) {

    console.error(err);
    showAuthView();
  }

  setTimeout(() => {

    if (splash) {
      splash.classList.add("hide");
    }

  }, 1500);
}

tabLogin?.addEventListener("click", () => {

  clearMessage();
  setActiveForm("login");
});

tabReset?.addEventListener("click", () => {

  clearMessage();
  setActiveForm("reset");
});

goToReset?.addEventListener("click", () => {

  clearMessage();
  setActiveForm("reset");
});

backToLogin?.addEventListener("click", () => {

  clearMessage();
  setActiveForm("login");
});

loginForm?.addEventListener("submit", async function (e) {

  e.preventDefault();

  clearMessage();

  try {

    const {
      data,
      error
    } = await supabase.auth.signInWithPassword({

      email: loginEmail.value.trim(),
      password: loginPassword.value
    });

    if (error) {

      showMessage(error.message);
      return;
    }

    showAppView(data.session);

  } catch (err) {

    console.error(err);
    showMessage("No se pudo iniciar sesión.");
  }
});

resetForm?.addEventListener("submit", async function (e) {

  e.preventDefault();

  clearMessage();

  try {

    const {
      error
    } = await supabase.auth.resetPasswordForEmail(
      resetEmail.value.trim(),
      {
        redirectTo:
          window.location.origin +
          window.location.pathname +
          "?type=recovery"
      }
    );

    if (error) {

      showMessage(error.message);
      return;
    }

    showMessage(
      "Te hemos enviado un enlace para recuperar tu contraseña.",
      "success"
    );

  } catch (err) {

    console.error(err);

    showMessage(
      "No se pudo enviar el email."
    );
  }
});

updateForm?.addEventListener("submit", async function (e) {

  e.preventDefault();

  clearMessage();

  if (newPassword.value !== confirmPassword.value) {

    showMessage("Las contraseñas no coinciden.");
    return;
  }

  try {

    const {
      error
    } = await supabase.auth.updateUser({

      password: newPassword.value
    });

    if (error) {

      showMessage(error.message);
      return;
    }

    showMessage(
      "Contraseña actualizada correctamente.",
      "success"
    );

    setActiveForm("login");

  } catch (err) {

    console.error(err);

    showMessage(
      "No se pudo actualizar la contraseña."
    );
  }
});

logoutBtn?.addEventListener("click", async () => {

  try {

    await supabase.auth.signOut();

    showAuthView();

  } catch (err) {

    console.error(err);
  }
});

async function loadMyOrders() {

  if (!currentSession) return;

  ordersLoading.style.display = "block";
  ordersEmpty.style.display = "none";
  ordersList.innerHTML = "";

  try {

    const {
      data,
      error
    } = await supabase
      .from("pedidos")
      .select("*")
      .eq(
        "cliente",
        currentSession.user.email
      )
      .order("fecha", {
        ascending: false
      });

    if (error) {
      throw error;
    }

    if (!data || !data.length) {

      ordersEmpty.style.display = "block";
      return;
    }

    data.forEach(pedido => {

      const div = document.createElement("div");

      div.className = "orderItem";

      div.innerHTML = `
        <div class="orderHead">
          <div class="orderMeta">
            <div class="orderId">
              Pedido #${pedido.id || ""}
            </div>

            <div class="orderDate">
              ${pedido.fecha || ""}
            </div>
          </div>

          <div class="orderTotal">
            ${pedido.total || "0"} €
          </div>
        </div>
      `;

      ordersList.appendChild(div);
    });

  } catch (err) {

    console.error(err);

    ordersEmpty.style.display = "block";
  }

  ordersLoading.style.display = "none";
}

openOrdersBtn?.addEventListener("click", async () => {

  ordersPanel.classList.add("show");

  await loadMyOrders();
});

closeOrdersBtn?.addEventListener("click", () => {

  ordersPanel.classList.remove("show");
});

refreshOrdersBtn?.addEventListener("click", async () => {

  await loadMyOrders();
});

window.addEventListener(
  "beforeinstallprompt",
  (e) => {

    e.preventDefault();

    deferredPrompt = e;

    installBtn.classList.add("show");

    installHint.style.display = "block";
  }
);

installBtn?.addEventListener("click", async () => {

  if (!deferredPrompt) return;

  deferredPrompt.prompt();

  await deferredPrompt.userChoice;

  deferredPrompt = null;

  installBtn.classList.remove("show");
});

avisosBtn?.addEventListener("click", () => {

  avisosPanel.classList.add("activo");
});

cerrarAvisosBtn?.addEventListener("click", () => {

  avisosPanel.classList.remove("activo");
});

window.addEventListener("load", async () => {

  await checkSession();
});
