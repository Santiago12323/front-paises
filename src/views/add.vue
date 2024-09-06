<template>
  <div>
    <NavBar />
    <div v-if="!agregar" class="position-absolute top-50 start-50 translate-middle">
      <table class="table table-bordered table-secondary table-hover text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Bandera</th>
            <th>Capital</th>
            <th>Lenguaje</th>
            <th>Área</th>
            <th>PIB</th>
            <th>Temperatura</th>
          </tr>
        </thead>
        <tbody class="table-group-divider" id="contenido">
          <tr v-for="(pais, index) in paises" :key="pais.id">
            <td>{{ index + 1 }}</td>
            <td>{{ pais.nombre_pais }}</td>
            <td> cargando ...</td>
            <td>{{ pais.capital }}</td>
            <td>{{ pais.lenguaje }}</td>
            <td>{{ pais.area }}</td>
            <td>{{ pais.pib }}</td>
            <td>{{ pais.temperatura }}</td>
            <td>
              <button class="btn btn-danger" @click="deletePais(pais.nombre_pais)">x</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="agregar">
      <FormComponent @added="fetchPaises" />
    </div>
    <div class="button-container">
      <button type="button" class="btn btn-success" @click="handleAdd">Agregar</button>
      <button type="button" class="btn btn-danger" @click="handleDelete">Cerrar</button>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import NavBar from '../components/navBar.vue';
import FormComponent from '../components/formulario.vue';

export default {
  name: 'Add',
  components: {
    NavBar,
    FormComponent
  },
  setup() {
    const agregar = ref(false);
    const paises = ref([]);

    const fetchPaises = async () => {
      try {
        const response = await axios.get('https://apiparapaises.onrender.com/api/paises');
        paises.value = response.data;
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const deletePais = async (nombrePais) => {
      try {
        await axios.delete(`https://apiparapaises.onrender.com/api/paises/nombre/${nombrePais}`);
        fetchPaises(); // Actualizar la lista de países después de la eliminación
      } catch (error) {
        console.error('Error deleting data:', error);
      }
    };

    onMounted(() => {
      fetchPaises();
    });

    const handleAdd = () => {
      agregar.value = true;
    };

    const handleDelete = () => {
      agregar.value = false;
    };

    return {
      agregar,
      handleAdd,
      handleDelete,
      fetchPaises,
      deletePais,
      paises
    };
  }
}
</script>

<style scoped>
.table-container {
  margin-top: 100px;
  display: flex;
  justify-content: center;
}

.table-wrapper {
  width: 100%;
  max-width: 1200px; /* Ajusta según el tamaño deseado */
}

.button-container {
  position: fixed;
  top: 100px; /* Cambiado de bottom a top */
  right: 30px;
  display: flex;
  gap: 10px;
}
</style>
