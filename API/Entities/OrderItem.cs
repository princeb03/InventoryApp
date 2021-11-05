using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class OrderItem
    {
        public long Id { get; set; }
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        public Guid ProductId { get; set; }
        public InventoryItem Product { get; set; }
        public int Quantity { get; set; }
    }
}