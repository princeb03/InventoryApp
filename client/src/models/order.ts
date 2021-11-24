import { CreateOrderItemAPI, OrderItem } from "./orderItem";

export interface OrderCart {
    orderItems: OrderItem[]
};

export interface CreateOrderDto {
    orderItems: CreateOrderItemAPI[];
}

