using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.OrderDTOs
{
    public class CreateOrderDto
    {
        [Required]
        public List<CreateOrderItemDto> OrderItems { get; set; }
        public string Notes { get; set; }
    }
}