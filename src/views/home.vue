<template>
  <div>
    <NavBar />

    <div v-if="buscando" class="position-absolute top-0 start-0" id="regresar">
      <button type="button" class="btn btn-danger" id="regresar" @click="regresar"> regresar </button>
    </div>

    <div class="buscador mb-4" id="buscador">
      <Buscador @buscar="handleBuscar" />
    </div>
    <!-- galeria -->
    <div v-if="!buscando" class="container mt-4">
      <div class="position-absolute top-50 start-50 translate-middle" id="galeria">
        <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-5">
          <div v-for="pais in filteredPaises" :key="pais" class="col mb-4">
            <Tarjeta :nombre="pais" />
          </div>
        </div>
      </div>
    </div>
    <!-- buscar el pais -->
    <div v-else class="position-absolute top-50 start-50 translate-middle">
      <Tarjeta :nombre="query" />
    </div>

  </div>
</template>

<script>
import Buscador from '../components/buscador.vue';
import Tarjeta from '../components/tarjeta.vue';
import NavBar from '../components/navBar.vue';

export default {
  name: 'Home',
  
  components: {
    Buscador,
    Tarjeta,
    NavBar
  },
  data() {
    return {
      paises: [
        'Colombia',
        'Argentina',
        'Canada',
        'España',
        'Brazil',
        'Peru',
        'Ecuador',
        'Australia',
        'Mexico',
        'Portugal',
        'Puerto Rico',
        'Usa',
        'Panama',
        'Venezuela',
        'usa'
      ],
      buscando: false,
      query: ''
    };
    
  },
  
  computed: {
    filteredPaises() {
      // Filtra los países basados en el valor del query
      if (this.query.trim() === '') {
        return this.paises;
      }
      return this.paises.filter(pais => pais.toLowerCase().includes(this.query.toLowerCase()));
    }
  },
  methods: {
    handleBuscar(query) {
      this.query = query;
      this.buscando = true; // Cambia la variable a true cuando se presiona el botón "Buscar"
      console.log("Buscando:", this.query);
    },
    regresar() {
      // Elige una de las siguientes opciones:
      // Opción 1: Refrescar la página
      // window.location.reload();

      // Opción 2: Regresar sin refrescar la página
      this.query = '';
      this.buscando = false;
    }
  }
}
</script>

<style scoped>
#galeria {
  margin-top: 260px;
}

#buscador {
  position: fixed;
  top: 120px; /* Ajusta según lo necesario */
  left: 50%;
  transform: translateX(-50%);
  text-align: center; /* Centra el buscador */
  z-index: 1000; /* Asegura que el buscador esté encima de otros elementos */
}

.container {
  padding-left: 0;
  padding-right: 0;
}

.row-cols-lg-5 .col {
  display: flex;
  justify-content: center; /* Centra el contenido dentro de cada columna */
}

.tarjeta-container {
  min-width: 250px; /* Ajusta este valor para aumentar el ancho de las tarjetas */
  width: 100%;
}

.tarjeta {
  width: 100%; /* Asegura que la tarjeta ocupe el 100% del contenedor */
}

#regresar {
  margin-top: 61px;
  margin-left: 580px;
  border-radius: 10px;
}
</style>
