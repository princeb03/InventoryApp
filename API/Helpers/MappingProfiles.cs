using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.InventoryItemDTOs;
using API.DTOs.OrderDTOs;
using API.DTOs.ProfileDTOs;
using API.Entities;
using AutoMapper;

namespace API.Helpers
{
    public class MappingProfiles: Profile
    {
        public MappingProfiles()
        {
            CreateMap<Order, OrderDto>();
            CreateMap<CreateOrderDto, Order>();
            CreateMap<OrderItem, OrderItemDto>()
                .ForMember(o => o.Order, opt => opt.MapFrom(o => o.OrderId));
            CreateMap<AppUser,ProfileDto>()
                .ForMember(p => p.DisplayName, opt => opt.MapFrom(u => u.DisplayName))
                .ForMember(p => p.Email, opt => opt.MapFrom(u => u.Email))
                .ForMember(p => p.Username, opt => opt.MapFrom(u => u.UserName))
                .ForMember(p => p.Orders, opt => opt.MapFrom(u => u.Orders));

            CreateMap<CreateInventoryItemDto, InventoryItem>();
            CreateMap<InventoryItem, InventoryItemDto>();
            CreateMap<InventoryItem, ItemDetailsDto>();

        }
    }
}