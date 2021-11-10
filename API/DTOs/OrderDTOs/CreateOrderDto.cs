using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.OrderDTOs
{
    public class CreateOrderDto
    {
        public string Status { get; set; }
        public List<CreateOrderItemDto> OrderItems { get; set; }
    }
}