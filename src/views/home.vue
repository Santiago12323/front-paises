<template>
    <div>
      <navBar/>
  
      <div class="buscador mb-4" id="buscador">
        <buscador />
      </div>
      
      <div class="container mt-4" id="gallery">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4">
          <div v-for="pais in paises" :key="pais" class="col mb-4">
            <tarjeta :nombre="pais" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>


  import Buscador from '../components/buscador.vue';
  import Tarjeta from '../components/tarjeta.vue';
  import NavBar from '../components/navBar.vue';
  
  export default {
    name: 'home',
    components: {
      Buscador,
      Tarjeta,
      NavBar
    },
    data() {
      return {
        paises: [
          'colombia',
          'Argentina',
          'Canada',
          'España',
          'Brazil',
          'Peru',
          'Ecuador',
          'Australia',
          'Mexico',
          'Portugal',
          'Puerto rico',
          'Usa',
          'Panama',
          'Venezuela'
        ]
      };
    }
  };
  </script>
  
  <style scoped>
    #gallery {
      margin-top: 80px;
    }
  
    #buscador {
      margin-top: 100px; /* Ajusta según lo necesario */
      margin-left: 601px;
      margin-right: auto;
      text-align: center; /* Centra el buscador */
    }
  
    .buscador {
      margin-bottom: 40px;
    }
  
    .container {
      padding-left: 0;
      padding-right: 0;
    }
  
    .row-cols-lg-4 .col {
      display: flex;
      justify-content: center; /* Centra el contenido dentro de cada columna */
    }
  </style>
  