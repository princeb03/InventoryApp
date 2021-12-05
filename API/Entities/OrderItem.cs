using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class OrderItem
    {
        public long Id { get; set; }
        public Guid OrderId { get; set; }
        [Required]
        public Order Order { get; set; }
        public Guid ProductId { get; set; }
        [Required]
        public InventoryItem Product { get; set; }
        [Required]
        [Range(1,99999)]
        public int Quantity { get; set; }
    }
}