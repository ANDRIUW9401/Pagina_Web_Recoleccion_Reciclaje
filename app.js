
// ====== REFERENCIAS A VISTAS ======
const views = {
  login: document.getElementById("login-view"),
  register: document.getElementById("register-view"),
  dashboard: document.getElementById("dashboard-view"),
};

let currentUser = null;

function showView(name) {
  Object.values(views).forEach((v) => v.classList.remove("active"));
  views[name].classList.add("active");
}


// ====== USUARIOS EN LOCALSTORAGE ======
function seedUsers() {
  if (!localStorage.getItem("usuarios")) {
    const demoUsers = [
      {
        id: 1,
        nombre: "Usuario Demo",
        email: "demo@eco.com",
        password: "123456",
        rol: "administrador",
      },
    ];
    localStorage.setItem("usuarios", JSON.stringify(demoUsers));
  }
}

function getUsers() {
  return JSON.parse(localStorage.getItem("usuarios")) || [];
}

function saveUsers(users) {
  localStorage.setItem("usuarios", JSON.stringify(users));
}

// ====== CASOS (ARREGLO EN MEMORIA) ======
let cases = [
  {
    id: "REC-001",
    fecha: "2025-10-01",
    material: "Plástico",
    peso: 12,
    ubicacion: "Parque Central",
    estado: "Pendiente",
  },
  {
    id: "REC-002",
    fecha: "2025-10-03",
    material: "Vidrio",
    peso: 8.5,
    ubicacion: "Barrio La Floresta",
    estado: "En proceso",
  },
  {
    id: "REC-003",
    fecha: "2025-10-04",
    material: "Cartón",
    peso: 25,
    ubicacion: "Colegio Distrital Verde",
    estado: "Completado",
  },
  {
    id: "REC-004",
    fecha: "2025-10-05",
    material: "Orgánico",
    peso: 40,
    ubicacion: "Plaza de Mercado Norte",
    estado: "Pendiente",
  },
  {
    id: "REC-005",
    fecha: "2025-10-06",
    material: "Metales",
    peso: 15,
    ubicacion: "Edificio EcoCiudad",
    estado: "Completado",
  },
];

// ====== LOGIN ======
const loginForm = document.getElementById("login-form");
const loginMessage = document.getElementById("login-message");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginMessage.textContent = "";
  loginMessage.className = "message";

  const email = document.getElementById("login-email").value.trim();
  const password = document.getElementById("login-password").value.trim();

  const users = getUsers();
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    loginMessage.textContent = "Correo o contraseña incorrectos.";
    loginMessage.classList.add("error");
    return;
  }

  currentUser = user;
  document.getElementById("current-user-name").textContent =
    `${user.nombre} · ${user.rol}`;
  loginForm.reset();
  showView("dashboard");
  activatePane("consulta");
  renderCases();
});

document.getElementById("go-to-register").addEventListener("click", (e) => {
  e.preventDefault();
  showView("register");
});

// ====== REGISTRO USUARIO ======
const registerForm = document.getElementById("register-form");
const registerMessage = document.getElementById("register-message");

registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  registerMessage.textContent = "";
  registerMessage.className = "message";

  const nombre = document.getElementById("reg-name").value.trim();
  const email = document.getElementById("reg-email").value.trim();
  const rol = document.getElementById("reg-role").value;
  const password = document.getElementById("reg-password").value.trim();
  const password2 = document.getElementById("reg-password2").value.trim();

  if (password.length < 6) {
    registerMessage.textContent = "La contraseña debe tener mínimo 6 caracteres.";
    registerMessage.classList.add("error");
    return;
  }

  if (password !== password2) {
    registerMessage.textContent = "Las contraseñas no coinciden.";
    registerMessage.classList.add("error");
    return;
  }

  const users = getUsers();
  const emailExists = users.some((u) => u.email === email);

  if (emailExists) {
    registerMessage.textContent = "Ya existe un usuario registrado con ese correo.";
    registerMessage.classList.add("error");
    return;
  }

  const newUser = {
    id: Date.now(),
    nombre,
    email,
    password,
    rol,
  };

  users.push(newUser);
  saveUsers(users);

  registerMessage.textContent =
    "Usuario registrado correctamente. Ahora puedes iniciar sesión.";
  registerMessage.classList.add("success");

  setTimeout(() => {
    registerForm.reset();
    registerMessage.textContent = "";
    showView("login");
  }, 1600);
});

document.getElementById("back-to-login").addEventListener("click", () => {
  registerForm.reset();
  registerMessage.textContent = "";
  showView("login");
});

// ====== LOGOUT ======
document.getElementById("logout-btn").addEventListener("click", () => {
  currentUser = null;
  loginMessage.textContent = "";
  registerMessage.textContent = "";
  showView("login");
});

// ====== CONSULTA DE CASOS ======
const tbody = document.getElementById("cases-table-body");
const filterTextInput = document.getElementById("filter-text");
const filterStatusSelect = document.getElementById("filter-status");

function renderCases() {
  if (!tbody) return;

  const searchText = (filterTextInput?.value || "").trim().toLowerCase();
  const statusFilter = filterStatusSelect?.value || "";

  tbody.innerHTML = "";

  cases
    .filter((c) => {
      const matchesText =
        c.material.toLowerCase().includes(searchText) ||
        c.ubicacion.toLowerCase().includes(searchText) ||
        c.id.toLowerCase().includes(searchText);
      const matchesStatus = statusFilter ? c.estado === statusFilter : true;
      return matchesText && matchesStatus;
    })
    .forEach((c) => {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = c.id;

      const tdFecha = document.createElement("td");
      tdFecha.textContent = c.fecha;

      const tdMaterial = document.createElement("td");
      tdMaterial.textContent = c.material;

      const tdPeso = document.createElement("td");
      tdPeso.textContent = c.peso.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      });

      const tdUbicacion = document.createElement("td");
      tdUbicacion.textContent = c.ubicacion;

      const tdEstado = document.createElement("td");
      const spanEstado = document.createElement("span");
      spanEstado.textContent = c.estado;
      spanEstado.classList.add("status-chip");

      if (c.estado === "Pendiente") {
        spanEstado.classList.add("status-pendiente");
      } else if (c.estado === "En proceso") {
        spanEstado.classList.add("status-en-proceso");
      } else {
        spanEstado.classList.add("status-completado");
      }

      tdEstado.appendChild(spanEstado);

      tr.append(tdId, tdFecha, tdMaterial, tdPeso, tdUbicacion, tdEstado);
      tbody.appendChild(tr);
    });
}

if (filterTextInput) {
  filterTextInput.addEventListener("input", renderCases);
}
if (filterStatusSelect) {
  filterStatusSelect.addEventListener("change", renderCases);
}

// ====== REGISTRO DE CASOS ======
const menuCasos = document.getElementById("menu-casos");
const menuRegistrar = document.getElementById("menu-registrar");
const paneConsulta = document.getElementById("content-consulta");
const paneRegistro = document.getElementById("content-registro");

function activatePane(which) {
  if (!paneConsulta || !paneRegistro) return;

  if (which === "consulta") {
    paneConsulta.classList.remove("hidden");
    paneRegistro.classList.add("hidden");
    menuCasos?.classList.add("active");
    menuRegistrar?.classList.remove("active");
  } else {
    paneConsulta.classList.add("hidden");
    paneRegistro.classList.remove("hidden");
    menuCasos?.classList.remove("active");
    menuRegistrar?.classList.add("active");
  }
}

menuCasos?.addEventListener("click", () => {
  activatePane("consulta");
  renderCases();
});

menuRegistrar?.addEventListener("click", () => {
  activatePane("registro");
});

const caseForm = document.getElementById("case-form");
const caseMessage = document.getElementById("case-message");

if (caseForm) {
  caseForm.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!caseMessage) return;
    caseMessage.textContent = "";
    caseMessage.className = "message";

    const fecha = document.getElementById("case-date").value;
    const material = document.getElementById("case-material").value;
    const pesoStr = document.getElementById("case-weight").value;
    const ubicacion = document.getElementById("case-location").value.trim();
    const estado = document.getElementById("case-status").value;
    const notas = document.getElementById("case-notes").value.trim();

    const peso = parseFloat(pesoStr);

    if (!fecha || !material || !ubicacion || !estado) {
      caseMessage.textContent = "Por favor completa todos los campos obligatorios.";
      caseMessage.classList.add("error");
      return;
    }

    if (isNaN(peso) || peso <= 0) {
      caseMessage.textContent = "Ingresa un peso válido mayor que cero.";
      caseMessage.classList.add("error");
      return;
    }

    const nextNumber = cases.length + 1;
    const id = "REC-" + String(nextNumber).padStart(3, "0");

    const newCase = {
      id,
      fecha,
      material,
      peso,
      ubicacion,
      estado,
      notas,
    };

    cases.push(newCase);

    caseMessage.textContent = "Caso registrado correctamente.";
    caseMessage.classList.add("success");

    caseForm.reset();
    document.getElementById("case-status").value = "Pendiente";

    renderCases();
  });
}

// botón dentro del formulario para saltar a la lista
const goToListBtn = document.getElementById("go-to-list");
goToListBtn?.addEventListener("click", () => {
  activatePane("consulta");
  renderCases();
});

// ====== INICIALIZACIÓN ======
document.addEventListener("DOMContentLoaded", () => {
  seedUsers();
  showView("login");
});
