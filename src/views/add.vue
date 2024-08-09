<template>
    <div>
      <NavBar />
      <button type="button" class="btn btn-success">Agregar</button>
      <button type="button" class="btn btn-danger">Eliminar</button>
    </div>
  </template>
  
  <script>
  import NavBar from '../components/navBar.vue'; // Asegúrate de la ruta correcta
  
  export default {
    name: 'Add',
    components: {
      NavBar // Registra el componente NavBar aquí
    }
  }
  </script>
  
  <style scoped>
  /* Aquí puedes agregar estilos específicos para la vista Add */
  </style>
  