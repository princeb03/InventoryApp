using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.InventoryItemDTOs
{
    public class CreateInventoryItemDto : IValidatableObject
    {
        [Required(ErrorMessage = "Item name required.")]
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        [Required(ErrorMessage = "Total Stock number required.")]
        [Range(0, 99999)]
        public int TotalStock { get; set; }
        [Required]
        [Range(0, 99999)]
        public int AvailableStock { get; set; }

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