using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.OrderDTOs;

namespace API.DTOs.InventoryItemDTOs
{
    public class ItemDetailsDto
    {
        public Guid Id { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public int TotalStock { get; set; }
        public int AvailableStock { get; set; }
        public ICollection<OrderItemDto> Orders { get; set; }
    }
}