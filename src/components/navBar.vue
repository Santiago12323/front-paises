<template>
    <div class="nav-container">
      <ul class="nav nav-tabs justify-content-center">
        <li class="nav-item" @click="goHome">
          <a class="nav-link" aria-current="page" href="#">Home</a>
        </li>
        <li class="nav-item" @click="goadd">
          <a class="nav-link" href="#">add</a>
        </li>
        <li class="nav-item" @click="goInfo">
          <a class="nav-link" href="#">Info</a>
        </li>
      </ul>
    </div>
  </template>
  
  <script>
  import { useRouter } from 'vue-router';
  
  export default {
    name: 'NavBar',
    setup() {
      const router = useRouter();
  
      const goHome = () => {
        router.push('/');
      };
  
      const goadd = () => {
        router.push('/add');
      };
  
      const goInfo = () => {
        router.push('/info');
      };
  
      return {
        goHome,
        goadd,
        goInfo
      };
    }
  };
  </script>
  
  <style scoped>
  .nav-container {
    display: flex;
    justify-content: center; /* Centra horizontalmente el contenido */
    align-items: center; /* Centra verticalmente el contenido */
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: #f8f9fa; /* Color de fondo del contenedor */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Sombra para separación visual */
    z-index: 1000; /* Asegúrate de que el navbar esté por encima de otros elementos */
  }
  
  .nav-tabs {
    display: flex;
    flex-direction: row; /* Alinea los elementos horizontalmente */
    font-size: 1.6rem; /* Tamaño del texto para los enlaces de navegación */
  }
  
  .nav-item {
    margin: 0 15px; /* Añade margen a los lados de cada ítem */
  }
  
  .nav-link {
    transition: background-color 0.3s ease, color 0.3s ease; /* Transición suave para el color de fondo y texto */
    color: #495057; /* Color del texto inicial */
  }
  
  .nav-link:hover {
    background-color: white; /* Color de fondo cuando el mouse pasa sobre el enlace */
    color: #007bff; /* Color del texto cuando el mouse pasa sobre el enlace */
    border-radius: 0.25rem; /* Bordes redondeados para un estilo más suave */
  }
  </style>
  