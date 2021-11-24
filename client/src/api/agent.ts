import axios, { AxiosResponse } from "axios";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";
import { CreateOrderDto } from "../models/order";
import { Profile, ProfileOrder } from "../models/profile";
import { User, UserFormValues } from "../models/user";

const sleep = () => {
    return new Promise(resolve => {
        setTimeout(resolve, 1000);
    });
};

axios.defaults.baseURL = 'http://localhost:5000/api';

axios.interceptors.request.use(config => {
    const token = localStorage.getItem('inventoryToken');
    if (token) {
        config.headers = {
            Authorization: `Bearer ${token}`
        };
    }
    return config;
});

axios.interceptors.response.use( async response => {
    await sleep();
    return response;
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody)
};

const Inventory = {
    getAll: () => requests.get<InventoryItem[]>('/inventory'),
    get: (id: string) => requests.get<InventoryItem>(`/inventory/${id}`),
    create: (body: InventoryItemFormValues) => requests.post<void>('/inventory', body),
    edit: (body: InventoryItemFormValues) => requests.put<void>(`/inventory/${body.id}`, body)
};

const Accounts = {
    login: (user: UserFormValues) => requests.post<User>('/accounts/login', user),
    register: (user: UserFormValues) => requests.post<User>('/accounts/register', user),
    getCurrent: () => requests.get<User>('/accounts/current')
};

const Orders = {
    createOrder: (order: CreateOrderDto) => requests.post<void>('/orders', order),
    getAll: () => requests.get<any>('/orders'),
    toggleOrder: (id: string) => requests.put<void>(`/orders/${id}/complete`, {}),
    getOrder: (id: string) => requests.get<ProfileOrder>(`/orders/${id}`)
};

const Profiles = {
    getProfile: (username: string) => requests.get<Profile>(`/profiles/${username}`),
    getAll: () => requests.get<Profile[]>('/profiles')
};

const agent = {
    Inventory,
    Accounts,
    Orders,
    Profiles
};

export default agent;