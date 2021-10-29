using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class InventoryItemDto
    {
        public string ItemName { get; set; }
        public string ItemDescription { get; set; }
        public int TotalStock { get; set; }
    }
}