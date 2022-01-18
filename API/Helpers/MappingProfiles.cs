using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.AccountDTOs;
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
            CreateMap<InventoryItem, InventoryItemDto>()
                .ForMember(o => o.MainPhoto, o => o.MapFrom(i => i.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<InventoryItem, ItemDetailsDto>()
                .ForMember(i => i.MainPhoto, o => o.MapFrom(i => i.Photos.FirstOrDefault(p => p.IsMain).Url));
            CreateMap<AppUser, UserDto>()
                .ForMember(u => u.DisplayName, o => o.MapFrom(u => u.DisplayName))
                .ForMember(u => u.Email, o => o.MapFrom(u => u.Email))
                .ForMember(u => u.Username, o => o.MapFrom(u => u.UserName))
                .ForMember(u => u.Token, o => o.Ignore())
                .ForMember(u => u.Role, o => o.Ignore());
        }
    }
}