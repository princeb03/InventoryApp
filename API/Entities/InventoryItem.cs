using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class InventoryItem
    {
        public Guid Id { get; set; }
        [Required]
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        [Required]
        public int TotalStock { get; set; }
        public ICollection<OrderItem> Orders { get; set; } = new List<OrderItem>();
    }
}