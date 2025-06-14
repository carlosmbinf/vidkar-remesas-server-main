import { Meteor } from 'meteor/meteor';
import fetch from 'node-fetch';

const API_KEY = 'DPcZVttDIjD5mWu7iyhpiR';
const BASE_URL = 'https://api.dingconnect.com/api/V1';

// Función genérica GET
async function fetchDingConnect(endpoint) {
  const url = `${BASE_URL}/${endpoint}`;

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      'api_key': API_KEY,
    },
  });

  if (!response.ok) {
    throw new Meteor.Error('api-error', `Error ${response.status} al obtener datos de ${endpoint}`);
  }

  return response.json();
}

// Nuevo método POST para enviar recarga
async function sendTransfer(data) {
  const url = `${BASE_URL}/SendTransfer`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'api_key': API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorText = await response.text(); // Puede contener más detalle
    throw new Meteor.Error('api-error', `Error ${response.status} al enviar transferencia: ${errorText}`);
  }

  return response.json();
}

Meteor.methods({
  async getProviders() {
    return await fetchDingConnect('GetProviders');
  },
  async getProducts() {
    return await fetchDingConnect('GetProducts');
  },
  async getProductsDescriptions() {
    return await fetchDingConnect('GetProductDescriptions');
  },
  async getRegions() {
    return await fetchDingConnect('GetRegions');
  },
  async getCountries() {
    return await fetchDingConnect('GetCountries');
  },
  async getDisponible(region) {
    return await fetchDingConnect('GetBalance');
  },
  async sendTransferDingConnect(_, data) {
    return await sendTransfer(data);
  }
});
