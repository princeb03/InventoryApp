using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.InventoryItemDTOs;

namespace API.DTOs.OrderDTOs
{
    public class CreateOrderItemDto
    {
        [Required]
        public Guid Product { get; set; }
        [Required]
        [Range(1, 99999)]
        public int Quantity { get; set; }
    }
}