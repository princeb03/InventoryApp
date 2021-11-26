using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;

namespace API.DTOs.InventoryItemDTOs
{
    public class InventoryItemDto
    {
        public Guid Id { get; set; }
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public int TotalStock { get; set; }
        public int AvailableStock { get; set; }
        public string MainPhoto { get; set; }
    }
}