import axios from 'axios';
import CryptoJS from 'crypto-js';

// Tu APP_KEY completa de Laravel (incluyendo el prefijo "base64:")
const SECRET_KEY_STRING = 'base64:idjCAVNj5OuFEEfXIzj0nOr3/TJ2/yqBp3Q25AbygXs=';

// 1. Instancia base con la URL de tu backend
const api = axios.create({
  baseURL: 'http://localhost/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 2. Interceptor de PETICIONES: Adjunta el token JWT si existe
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 3. Interceptor de RESPUESTAS: Descarga y descifra el encrypted_response nativo de Laravel
api.interceptors.response.use(
  (response) => {
    // Verificamos si la respuesta contiene el campo del cifrado nativo de Laravel
    if (response.data && response.data.encrypted_response) {
      try {
        // El payload de Laravel viene como un JSON en Base64 que contiene {iv, value, mac}
        const jsonPayload = JSON.parse(atob(response.data.encrypted_response));

        const iv = CryptoJS.enc.Base64.parse(jsonPayload.iv);
        const ciphertext = CryptoJS.enc.Base64.parse(jsonPayload.value);

        // Limpiamos el prefijo "base64:" usando la variable correcta SECRET_KEY_STRING
        const rawKey = CryptoJS.enc.Base64.parse(SECRET_KEY_STRING.replace('base64:', ''));

        // Desciframos usando AES-256-CBC con el IV y la clave nativa de Laravel
        const decrypted = CryptoJS.AES.decrypt(
          { ciphertext: ciphertext },
          rawKey,
          {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7
          }
        );

        const decryptedString = decrypted.toString(CryptoJS.enc.Utf8);

        if (!decryptedString) {
          throw new Error("El resultado del descifrado está vacío.");
        }

        // Reemplazamos los datos cifrados por el JSON original legible
        response.data = JSON.parse(decryptedString);
      } catch (e) {
        console.error("Error crítico al descifrar el encrypted_response de Laravel:", e);
      }
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;