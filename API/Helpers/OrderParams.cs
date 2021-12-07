using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class OrderParams : PagingParams
    {
        public bool IsCompleted { get; set; }
        public bool IsInUse { get; set; }
        public DateTime StartDate { get; set; } = DateTime.UtcNow;
    }
}