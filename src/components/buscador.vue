<template>
  <div class="buscador">
    <input 
      type="text" 
      class="form-control" 
      placeholder="Buscar país..." 
      aria-label="Buscar país" 
      v-model="query"
    />
    <button 
      class="btn btn-secondary" 
      type="button" 
      @click="buscar" 
      :disabled="isBlocked"
    >
      Buscar
    </button>
  </div>
</template>

<script>
export default {
  name: 'Buscador',
  data() {
    return {
      query: '' // Mantiene el valor del input
    };
  },
  computed: {
    isBlocked() {
      // Retorna true si el campo está vacío, false si tiene texto
      return this.query.trim() === '';
    }
  },
  methods: {
    buscar() {
      this.$emit('buscar', this.query); // Emitir el valor del input al hacer clic en el botón
    }
  }
}
</script>

<style scoped>
.buscador {
  display: flex;
  margin: 0 -180px 680px; /* Separar del nav-bar y las tarjetaas */
}

.form-control {
  width: 300px; /* Ajusta el ancho del input */
  padding: 0.5rem;
  border-radius: 20px;
}

.btn {
  margin-left: 5px; /* Espacio entre el input y el botón */
  border-radius: 15px;
}
</style>
