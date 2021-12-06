using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class Order
    {
        public Guid Id { get; set; }
        public string UserId { get; set; }
        public AppUser User { get; set; }
        [Required]
        public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
        public string OrderStatus { get; set; }
        public DateTime OrderCreatedAt { get; set; }
        public DateTime OrderCompletedAt { get; set; }
        public string Notes { get; set; }
    }
}