<template>
    <div class="caja-pais">
      <div class="caja-pais-inner">
        <div class="caja-pais-front">
          <img :src="flagUrl" alt="Country Flag" />
          <h5 class="card-title">{{ countryName }}</h5>
          <p class="card-text">Capital: {{ capital }}</p>
          <p class="card-text">Languages: {{ languages }}</p>
          <p class="card-text">Area: {{ area }}</p>
        </div>
        <div class="caja-pais-back">
          <p><strong>{{ countryName }}</strong></p>
          <p>GDP: {{ gdp }}</p>
          <p>Unemployment Rate: {{ unemploymentRate }}%</p>
          <p>Temperature: {{ temperature }}°C</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  
  const props = defineProps({
    nombre: {
      type: String,
      required: true
    }
  })
  
  const countryName = ref('');
  const flagUrl = ref('');
  const capital = ref('');
  const languages = ref('');
  const area = ref('');
  const gdp = ref('N/A');
  const unemploymentRate = ref('N/A');
  const temperature = ref('N/A');
  
  const fetchCountryData = async () => {
    try {
      const countryData = await obtenerDatosPais(props.nombre);
      flagUrl.value = countryData.flagUrl;
      capital.value = countryData.capital;
      languages.value = countryData.languages;
      area.value = countryData.area;
      gdp.value = countryData.gdp;
      unemploymentRate.value = countryData.unemploymentRate;
      temperature.value = countryData.temperature;
    } catch (error) {
      console.error('Error fetching country data:', error);
    }
  }
  
  const obtenerDatosPais = async (nombrePais) => {
    const urlBase = 'http://api.worldbank.org/v2';
    const weatherAppId = '5ac29935';
    const weatherAppKey = '7889b320888824f8d03ae8e399301063';
  
    const obtenerDatosGeograficos = async (nombrePais) => {
      try {
        const url = `https://restcountries.com/v3.1/name/${nombrePais}`;
        const response = await fetch(url);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          const cca2 = data[0].cca2;
          const latitud = data[0].latlng[0];
          const longitud = data[0].latlng[1];
          return {
            cca2,
            latitud,
            longitud,
            flagUrl: data[0].flags?.png || 'https://via.placeholder.com/150',
            capital: data[0].capital?.[0] || 'No disponible',
            languages: data[0].languages ? Object.values(data[0].languages).join(", ") : 'No disponible',
            area: data[0].area ? `${data[0].area.toLocaleString()} km²` : 'No disponible'
          };
        } else {
          throw new Error(`No se encontraron datos para el país ${nombrePais}.`);
        }
      } catch (error) {
        throw new Error(`Error al obtener datos geográficos: ${error.message}`);
      }
    }
  
    const obtenerDatosEconomicos = async (cca2) => {
      try {
        const urlPIB = `${urlBase}/country/${cca2}/indicator/NY.GDP.MKTP.CD?format=json`;
        const urlTasaDesempleo = `${urlBase}/country/${cca2}/indicator/SL.UEM.TOTL.ZS?format=json`;
  
        const [responsePIB, responseTasaDesempleo] = await Promise.all([
          fetch(urlPIB),
          fetch(urlTasaDesempleo)
        ]);
  
        const dataPIB = await responsePIB.json();
        const dataTasaDesempleo = await responseTasaDesempleo.json();
  
        if (dataPIB.length > 1) {
          const valoresPIB = dataPIB[1].slice(0, 5).map(entry => entry.value);
          const gdp = valoresPIB ? valoresPIB.map(pib => parseFloat(pib).toLocaleString(undefined, { maximumFractionDigits: 2 })).join(', ') : 'No disponible';
          const tasaDesempleo = dataTasaDesempleo.length > 1 ? dataTasaDesempleo[1][0]?.value || 'No disponible' : 'No disponible';
          return { gdp, tasaDesempleo };
        } else {
          throw new Error(`No se encontraron datos de PIB para el país con código ISO-2 ${cca2}.`);
        }
      } catch (error) {
        throw new Error(`Error al obtener datos económicos: ${error.message}`);
      }
    }
  
    const obtenerDatosClima = async (latitud, longitud) => {
      try {
        const url = `http://api.weatherunlocked.com/api/current/${latitud},${longitud}?app_id=${weatherAppId}&app_key=${weatherAppKey}`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.temp_c !== undefined) {
          return data.temp_c;
        } else {
          throw new Error(`No se pudo obtener la temperatura para las coordenadas (${latitud}, ${longitud}).`);
        }
      } catch (error) {
        throw new Error(`Error al obtener datos del clima: ${error.message}`);
      }
    }
  
    try {
      const { cca2, latitud, longitud, flagUrl, capital, languages, area } = await obtenerDatosGeograficos(nombrePais);
      const { gdp, tasaDesempleo } = await obtenerDatosEconomicos(cca2);
      const temp = await obtenerDatosClima(latitud, longitud);
      return {
        flagUrl,
        capital,
        languages,
        area,
        gdp,
        unemploymentRate: tasaDesempleo,
        temperature: temp
      };
    } catch (error) {
      throw new Error(`Error al obtener datos del país: ${error.message}`);
    }
  }
  
  onMounted(() => {
    fetchCountryData();
  });
  </script>
  
  <style scoped>
  .caja-pais {
    width: 180px;
    height: 280px;
    border: 1px solid #ffffff;
    border-radius: 10px;
    perspective: 1000px;
    margin: 10px;
  }
  
  .caja-pais-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }
  
  .caja-pais-front,
  .caja-pais-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    border-radius: 10px;
    padding: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    text-align: center;
  }
  
  .caja-pais-front {
    background-color: #6e7f8a;
  }
  
  .caja-pais-back {
    background-color: #6a8291;
    color: white;
    transform: rotateY(180deg);
  }
  
  .caja-pais:hover .caja-pais-inner {
    transform: rotateY(180deg);
  }
  
  .caja-pais img {
    width: 100%;
    max-height: 120px;
    object-fit: cover;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .caja-pais p {
    margin-bottom: 10px;
  }
  </style>
  