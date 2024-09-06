<template>
  <NavBar />
  <div class="container mt-5 text-center">
    <!-- Mostrar menú de opciones si el usuario no está autenticado y no se está mostrando el formulario de inicio de sesión ni el de creación de usuario -->
    <div v-if="!iniciar && !mostrarFormulario && !mostrarCrearUsuario" class="position-absolute top-50 start-50 translate-middle form-container">
      <p class="alert alert-warning">Debes iniciar sesión para acceder a la información.</p>
      <a @click="mostrarFormulario = true" class="btn btn-secondary">Iniciar sesión</a>
      <a @click="mostrarCrearUsuario = true" class="btn btn-primary">Crear cuenta</a>
    </div>
    
    <!-- Formulario de inicio de sesión centrado -->
    <div v-if="mostrarFormulario" class="position-absolute top-50 start-50 translate-middle form-container">
      <form @submit.prevent="login">
        <div class="mb-3">
          <label for="exampleInputUsername" class="form-label">Nombre de usuario</label>
          <input type="text" class="form-control" id="exampleInputUsername" v-model="usuario">
        </div>
        <div class="mb-3">
          <label for="exampleInputPassword1" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="exampleInputPassword1" v-model="contraseña">
        </div>
        <button type="submit" class="btn btn-primary">Iniciar sesión</button>
        <div v-if="mensaje" :class="{'alert': true, 'alert-success': exito, 'alert-danger': !exito}" class="mt-3">
          {{ mensaje }}
        </div>
      </form>
    </div>

    <!-- Formulario de creación de usuario centrado -->
    <div v-if="mostrarCrearUsuario" class="position-absolute top-50 start-50 translate-middle form-container">
      <form @submit.prevent="crearUsuario">
        <div class="mb-3">
          <label for="nuevoUsuario" class="form-label">Nombre de usuario</label>
          <input type="text" class="form-control" id="nuevoUsuario" v-model="nuevoUsuario">
        </div>
        <div class="mb-3">
          <label for="nuevaContraseña" class="form-label">Contraseña</label>
          <input type="password" class="form-control" id="nuevaContraseña" v-model="nuevaContraseña">
        </div>
        <button type="submit" class="btn btn-primary">Crear cuenta</button>
        <div v-if="mensajeCrearUsuario" :class="{'alert': true, 'alert-success': exitoCrearUsuario, 'alert-danger': !exitoCrearUsuario}" class="mt-3">
          {{ mensajeCrearUsuario }}
        </div>
      </form>
    </div>
    
    <!-- Información del usuario autenticado -->
    <div v-if="iniciar && !mostrarFormulario && !mostrarCrearUsuario" class="position-absolute top-50 start-50 translate-middle form-container">
      <h1 class="text-black">Bienvenido, {{ usuarioAutenticado.nombre }}</h1>
      <p class="text-black">Has creado estos países:</p>
      <ul>
        <li v-for="pais in paises" :key="pais.nombre_pais" class="text-black">{{ pais.nombre_pais }}</li>
      </ul>
      <button @click="cerrarSesion" class="btn btn-danger">Cerrar sesión</button>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import NavBar from '../components/navBar.vue';

export default {
  name: 'info',
  components: {
    NavBar
  },
  setup() {
    const usuario = ref('');
    const contraseña = ref('');
    const iniciar = ref(false);
    const mostrarFormulario = ref(false);
    const mostrarCrearUsuario = ref(false);
    const mensaje = ref('');
    const exito = ref(false);
    const mensajeCrearUsuario = ref('');
    const exitoCrearUsuario = ref(false);
    const usuarioAutenticado = ref({ nombre: '' });
    const nuevoUsuario = ref('');
    const nuevaContraseña = ref('');
    const paises = ref([]);

    const login = async () => {
      try {
        const response = await fetch('https://apiparapaises.onrender.com/api/usuarios');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const usuarios = await response.json();

        const usuarioEncontrado = usuarios.find(u => u.usuario === usuario.value && u.contraseña === contraseña.value);

        if (usuarioEncontrado) {
          iniciar.value = true;
          usuarioAutenticado.value = usuarioEncontrado;
          mostrarFormulario.value = false;
          mostrarCrearUsuario.value = false;
          mensaje.value = '¡Inicio de sesión exitoso!';
          exito.value = true;
          await cargarPaises(); // Cargar los países creados por el usuario
        } else {
          mensaje.value = 'Usuario o contraseña incorrectos';
          exito.value = false;
        }
      } catch (error) {
        console.error('Error:', error);
        mensaje.value = 'Error en el inicio de sesión';
        exito.value = false;
      }
    };

    const crearUsuario = async () => {
      try {
        const response = await fetch('https://apiparapaises.onrender.com/api/usuarios', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            usuario: nuevoUsuario.value,
            contraseña: nuevaContraseña.value
          })
        });

        if (response.ok) {
          mensajeCrearUsuario.value = '¡Usuario creado exitosamente!';
          exitoCrearUsuario.value = true;
          mostrarCrearUsuario.value = false;
          mostrarFormulario.value = false;
        } else {
          mensajeCrearUsuario.value = 'Error al crear el usuario';
          exitoCrearUsuario.value = false;
        }
      } catch (error) {
        console.error('Error:', error);
        mensajeCrearUsuario.value = 'Error en la creación del usuario';
        exitoCrearUsuario.value = false;
      }
    };

    const cargarPaises = async () => {
      try {
        const response = await fetch(`https://apiparapaises.onrender.com/api/paisporusuario/santiago`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        paises.value = data;
      } catch (error) {
        console.error('Error:', error);
      }
    };

    const cerrarSesion = () => {
      iniciar.value = false;
      mostrarFormulario.value = false;
      mostrarCrearUsuario.value = false;
      usuarioAutenticado.value = { nombre: '' };
      paises.value = [];
    };

    return { 
      usuario, 
      contraseña, 
      iniciar, 
      login, 
      mensaje, 
      exito, 
      usuarioAutenticado,
      mostrarFormulario,
      mostrarCrearUsuario,
      nuevoUsuario,
      nuevaContraseña,
      crearUsuario,
      mensajeCrearUsuario,
      exitoCrearUsuario,
      cerrarSesion,
      paises
    };
  }
}
</script>

<style>
.form-label, .form-control, .btn {
  color: black; /* Cambia el color del texto a negro */
}

.form-container {
  background: linear-gradient(135deg, #f5f5f5, #e0e0e0); /* Degradado suave */
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.alert {
  padding: 15px;
  border-radius: 5px;
}

.text-black {
  color: black; /* Estilo para el texto en negro */
}
</style>
