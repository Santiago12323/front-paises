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
  
  <script>
  export default {
    name: 'Tarjeta',
    props: {
      countryName: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        flagUrl: '',
        capital: '',
        languages: '',
        area: '',
        gdp: 'N/A',
        unemploymentRate: 'N/A',
        temperature: 'N/A'
      };
    },
    async mounted() {
      await this.fetchCountryData();
    },
    methods: {
      async fetchCountryData() {
        try {
          const countryData = await this.obtenerDatosPais(this.countryName);
          this.flagUrl = countryData.flagUrl;
          this.capital = countryData.capital;
          this.languages = countryData.languages;
          this.area = countryData.area;
          this.gdp = countryData.gdp;
          this.unemploymentRate = countryData.unemploymentRate;
          this.temperature = countryData.temperature;
        } catch (error) {
          console.error('Error fetching country data:', error);
        }
      },
      async obtenerDatosPais(nombrePais) {
        const urlBase = 'http://api.worldbank.org/v2';
        const weatherAppId = '5ac29935';
        const weatherAppKey = '7889b320888824f8d03ae8e399301063';
  
        // Helper functions
        async function obtenerDatosGeograficos(nombrePais) {
          const url = `https://restcountries.com/v3.1/name/${nombrePais}`;
  
          return fetch(url)
            .then(response => response.json())
            .then(data => {
              if (Array.isArray(data) && data.length > 0) {
                const cca2 = data[0].cca2;
                const latitud = data[0].latlng[0];
                const longitud = data[0].latlng[1];
                return { cca2, latitud, longitud, flagUrl: data[0].flags?.png || 'https://via.placeholder.com/150', capital: data[0].capital?.[0] || 'No disponible', languages: data[0].languages ? Object.values(data[0].languages).join(", ") : 'No disponible', area: data[0].area ? `${data[0].area.toLocaleString()} km²` : 'No disponible' };
              } else {
                throw new Error(`No se encontraron datos para el país ${nombrePais}.`);
              }
            });
        }
  
        async function obtenerDatosEconomicos(cca2) {
          const urlPIB = `${urlBase}/country/${cca2}/indicator/NY.GDP.MKTP.CD?format=json`;
          const urlTasaDesempleo = `${urlBase}/country/${cca2}/indicator/SL.UEM.TOTL.ZS?format=json`;
  
          const requestPIB = fetch(urlPIB)
            .then(response => response.json())
            .then(data => {
              if (data.length > 1) {
                const valoresPIB = data[1]
                  .slice(0, 5)
                  .map(entry => entry.value);
                return valoresPIB;
              } else {
                throw new Error(`No se encontraron datos de PIB para el país con código ISO-2 ${cca2}.`);
              }
            });
  
          const requestTasaDesempleo = fetch(urlTasaDesempleo)
            .then(response => response.json())
            .then(data => {
              if (data.length > 1) {
                const tasaDesempleo = data[1][0]?.value || 'No disponible';
                return tasaDesempleo;
              } else {
                throw new Error(`No se encontraron datos de tasa de desempleo para el país con código ISO-2 ${cca2}.`);
              }
            });
  
          return Promise.all([requestPIB, requestTasaDesempleo])
            .then(resultados => ({
              valoresPIB: resultados[0],
              tasaDesempleo: resultados[1]
            }));
        }
  
        async function obtenerDatosClima(latitud, longitud) {
          const url = `http://api.weatherunlocked.com/api/current/${latitud},${longitud}?app_id=${weatherAppId}&app_key=${weatherAppKey}`;
  
          return fetch(url)
            .then(response => response.json())
            .then(data => {
              if (data.temp_c !== undefined) {
                return data.temp_c;
              } else {
                throw new Error(`No se pudo obtener la temperatura para las coordenadas (${latitud}, ${longitud}).`);
              }
            });
        }
  
        // Get geographic, economic, and climate data
        return obtenerDatosGeograficos(nombrePais)
          .then(({ cca2, latitud, longitud, flagUrl, capital, languages, area }) => {
            return Promise.all([
              obtenerDatosEconomicos(cca2),
              obtenerDatosClima(latitud, longitud)
            ])
              .then(([datosEconomicos, temperatura]) => {
                const { valoresPIB, tasaDesempleo } = datosEconomicos;
                const gdp = valoresPIB ? valoresPIB.map(pib => parseFloat(pib).toLocaleString(undefined, { maximumFractionDigits: 2 })).join(', ') : 'No disponible';
                return {
                  flagUrl,
                  capital,
                  languages,
                  area,
                  gdp,
                  unemploymentRate: tasaDesempleo,
                  temperature: temperatura
                };
              });
          });
      }
    }
  };
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
    padding: 10px; /* Ajusta el relleno para encajar mejor el contenido */
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
  