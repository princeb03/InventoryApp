import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { CreateOrderDto } from "../models/order";
import { OrderItem, CreateOrderItemAPI } from "../models/orderItem";
import { ProfileOrder } from "../models/profile";

export class OrderStore {
    cart: OrderItem[] = [];
    loadingInitial = false;
    loading = false;
    currentOrder: ProfileOrder | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    
    addToCart = (orderItem: OrderItem) => {
        for (let item of this.cart) {
            if (item.product.id === orderItem.product.id) {
                item.quantity += orderItem.quantity
                this.saveCartToStorage();
                return;
            }
        }
        this.cart.push(orderItem);
        this.saveCartToStorage();
    }

    removeFromCart = (index: number) => {
        this.cart.splice(index, 1);
        this.saveCartToStorage();
    }
    
    placeOrder = async (notes: string) => {
        this.loading = true;
        const itemsToOrder = this.cart.map(item => this.mapItemToApi(item));
        const order: CreateOrderDto = {
            orderItems: itemsToOrder,
            notes: notes
        };
        try {
            await agent.Orders.createOrder(order);
            runInAction(() => {
                this.loading = false;
                this.resetCart();
            })
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }

    getOrder = async (id: string) => {
        try {
            this.loadingInitial = true;
            const order = await agent.Orders.getOrder(id);
            runInAction(() => {
                this.currentOrder = order;
                this.loadingInitial = false;
            });
        } catch(err) {
            console.log(err);
            this.loadingInitial = false;
        }

    }

    mapItemToApi = (item: OrderItem): CreateOrderItemAPI => {
        return {
            product: item.product.id,
            quantity: item.quantity
        };
    }

    saveCartToStorage = () => {
        const json = JSON.stringify(this.cart);
        localStorage.setItem('ssInventoryCart', json);
    }

    resetCart = () => {
        this.cart = [];
        localStorage.removeItem('ssInventoryCart');
    }

    setCart = () => {
        const savedCart = localStorage.getItem('ssInventoryCart');
        if (savedCart) this.cart = JSON.parse(savedCart);
    }

    editNotes = async (orderId: string,updatedNotes: string) => {
        this.loading = true;
        try {
            await agent.Orders.editNotes(orderId, updatedNotes);
            runInAction(() => {
                this.getOrder(orderId);
                this.loading = false;
            });
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
    }

    toggleOrder = async (id: string) => {
        try {
            this.loading = true;
            await agent.Orders.toggleOrder(id);
            runInAction(() => {
                this.getOrder(id);
                this.loading = false;
            });
        } catch(err) {
            console.log(err);
            this.loading = false;
        }
        
    }
}