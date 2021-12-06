import { makeAutoObservable, runInAction } from "mobx"
import agent from "../api/agent";
import { CreateOrderDto } from "../models/order";
import { OrderItem, CreateOrderItemAPI } from "../models/orderItem";
import { ProfileOrder } from "../models/profile";

export class OrderStore {
    cart: OrderItem[] = [];
    loading = false;
    currentOrder: ProfileOrder | null = null;

    constructor() {
        makeAutoObservable(this);
    }
    
    addToCart = (orderItem: OrderItem) => {
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
            this.loading = true;
            const order = await agent.Orders.getOrder(id);
            runInAction(() => {
                this.currentOrder = order;
                this.loading = false;
            });
        } catch(err) {
            console.log(err);
            this.loading = false;
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