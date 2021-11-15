using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs.InventoryItemDTOs
{
    public class CreateInventoryItemDto
    {
        [Required]
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        [Required]
        public int TotalStock { get; set; }
        [Required]
        public int AvailableStock { get; set; }
    }
}