using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.Entities
{
    public class InventoryItem : IValidatableObject
    {
        public Guid Id { get; set; }
        [Required(ErrorMessage = "Item Name required.")]
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        [Required(ErrorMessage = "Total Stock number required.")]
        [Range(0, 99999)]
        public int TotalStock { get; set; }
        [Required(ErrorMessage = "Available Stock number required.")]
        [Range(0, 99999)]
        public int AvailableStock { get; set; }
        public ICollection<OrderItem> Orders { get; set; } = new List<OrderItem>();
        public ICollection<Photo> Photos { get; set; } = new List<Photo>();

        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (TotalStock < AvailableStock)
            {
                yield return new ValidationResult(
                    "Total Stock cannot be less than the Available Stock.",
                    new string[] { nameof(TotalStock), nameof(AvailableStock) }
                );
            }
        }
    }
}