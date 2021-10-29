import axios from "axios";
import { InventoryItemFormValues } from "../models/inventoryItem";

axios.defaults.baseURL = 'http://localhost:5000/api';

const requests = {
    get: (url: string) => axios.get(url).then(response => response.data),
    post: (url: string, body: {}) => axios.post(url, body).then(response => response.data),
    put: (url: string, body: {}) => axios.put(url, body).then(response => response.data)
};

const Inventory = {
    getAll: () => requests.get('/inventory'),
    get: (id: string) => requests.get(`/inventory/${id}`),
    create: (body: InventoryItemFormValues) => requests.post('/inventory', body),
    edit: (body: InventoryItemFormValues) => requests.put(`/inventory/${body.id}`, body)
};

const agent = {
    Inventory
};

export default agent;