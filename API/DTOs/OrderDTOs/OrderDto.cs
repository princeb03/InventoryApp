using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ProfileDTOs;
using API.Entities;

namespace API.DTOs.OrderDTOs
{
    public class OrderDto
    {
        public Guid Id { get; set; }
        public string User { get; set; }
        public ICollection<OrderItemDto> OrderItems { get; set; }
        public string OrderStatus { get; set; }
        public DateTime OrderCreatedAt { get; set; }
        public DateTime OrderCompletedAt { get; set; }
        public string Notes { get; set; }
    }
}