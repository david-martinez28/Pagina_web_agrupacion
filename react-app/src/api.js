import axios from 'axios';
import CryptoJS from 'crypto-js';

// Tu APP_KEY completa de Laravel (incluyendo el prefijo "base64:")
const SECRET_KEY_STRING = 'base64:idjCAVNj5OuFEEfXIzj0nOr3/TJ2/yqBp3Q25AbygXs=';

// 1. Instancia base con URL relativa o la IP/dominio de tu VPS
const api = axios.create({
  baseURL: '/api', // Usar '/api' permite que Caddy redirija automáticamente sin problemas de puertos o dominios
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
    if (response.data && response.data.encrypted_response) {
      try {
        const jsonPayload = JSON.parse(atob(response.data.encrypted_response));

        const iv = CryptoJS.enc.Base64.parse(jsonPayload.iv);
        const ciphertext = CryptoJS.enc.Base64.parse(jsonPayload.value);

        const rawKey = CryptoJS.enc.Base64.parse(SECRET_KEY_STRING.replace('base64:', ''));

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