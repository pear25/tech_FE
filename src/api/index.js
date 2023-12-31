import axios from "axios";

const BASE_URL = "https://mock-api.dev.lalamove.com"
// const LOCAL_URL = "http://localhost:8080"
const lalamoveAPI = axios.create({
    baseURL:
        BASE_URL
})

export const routingRequest = async (data) => { await lalamoveAPI.post('/route', data) }

export const getRoute = async (token) => { await lalamoveAPI.get(`/route/${token}`) }

export const testSuccess = async () => { await lalamoveAPI.post('/mock/route/success') }

export const test500 = async () => { await lalamoveAPI.post('/mock/route/500') }

