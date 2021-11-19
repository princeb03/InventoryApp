import { makeAutoObservable } from "mobx"
import agent from "../api/agent";
import { OrderItem } from "../models/orderItem";

export class OrderStore {
    cart: OrderItem[] = [];
    constructor() {
        makeAutoObservable(this);
    }
    
    addToCart = (orderItem: OrderItem) => {
        this.cart.push(orderItem);
    }

    removeFromCart = (index: number) => {
        this.cart.splice(index, 1);
    }
    
    placeOrder = async () => {
        return;
    }
}