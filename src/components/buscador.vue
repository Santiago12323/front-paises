<template>
    <div class="buscador">
      <input type="text" class="form-control" placeholder="Buscar país..." aria-label="Buscar país">
      <button class="btn btn-outline-secondary" type="button">Buscar</button>
    </div>
  </template>
  
  <style scoped>


  .buscador {
    display: flex;
    margin: 0 -180px 680px ; /* Separar del nav-bar y las tarjetas */
  }
  
  .form-control {
    width: 300px; /* Ajusta el ancho del input */
    padding: 0.5rem;
    border-radius: 20px;
  }
  
  .btn {
    margin-left: 5px; /* Espacio entre el input y el botón */
    border-radius:15px ;

  }
  </style>
  