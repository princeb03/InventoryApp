using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.InventoryItemDTOs;

namespace API.DTOs.OrderDTOs
{
    public class CreateOrderItemDto
    {
        public Guid Product { get; set; }
        public int Quantity { get; set; }
    }
}