using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class InventoryParams : PagingParams
    {
        public string SearchString { get; set; }
    }
}