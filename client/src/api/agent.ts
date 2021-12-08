import axios, { AxiosError, AxiosResponse } from "axios";
import { toast } from "react-toastify";
import { InventoryItem, InventoryItemFormValues } from "../models/inventoryItem";
import { CreateOrderDto } from "../models/order";
import { PaginatedResult } from "../models/pagination";
import Photo from "../models/photo";
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
    const pagination = response.headers["pagination"];
    if (pagination) {
        response.data = new PaginatedResult(response.data, JSON.parse(pagination));
        return response as AxiosResponse<PaginatedResult<any>>;
    }
    return response;
}, (error: AxiosError) => {
    const { data, status, statusText } = error.response!;
    if (!data) toast.error(statusText);
    else if (data.hasOwnProperty('errors')) {
        toast.error(data.title);
    }
    else {
        switch(status) {
            case 500:
                toast.error(data.message);
                break;
            default:
                toast.error(data);
        }
    }
    
    return Promise.reject(error);
});

const responseBody = <T>(response: AxiosResponse<T>) => response.data;

const requests = {
    get: <T>(url: string) => axios.get<T>(url).then(responseBody),
    post: <T>(url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
    put: <T>(url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
    delete: <T>(url: string) => axios.delete<T>(url).then(responseBody)
};

const Inventory = {
    getAll: (params: URLSearchParams) => axios.get<PaginatedResult<InventoryItem[]>>('/inventory', {params}).then(responseBody),
    get: (id: string) => requests.get<InventoryItem>(`/inventory/${id}`),
    create: (body: InventoryItemFormValues) => requests.post<void>('/inventory', body),
    edit: (body: InventoryItemFormValues) => requests.put<void>(`/inventory/${body.id}`, body),
    uploadPhoto: (file: Blob, itemId: string) => {
        let formData = new FormData();
        formData.append('File', file);
        return axios.post<Photo>(`/photos/${itemId}`, formData, {
            headers: {'Content-type': 'multipart/form-data'}
        });
    },
    setMainPhoto: (itemId: string, photoId: string) => requests.post<void>(`/photos/${itemId}/${photoId}/setMain`, {}),
    deletePhoto: (itemId: string, photoId: string) => requests.delete<void>(`/photos/${itemId}/${photoId}`)
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