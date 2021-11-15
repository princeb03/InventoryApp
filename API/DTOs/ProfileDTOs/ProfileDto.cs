using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.OrderDTOs;

namespace API.DTOs.ProfileDTOs
{
    public class ProfileDto
    {
        public string DisplayName { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public ICollection<OrderDto> Orders { get; set; }
    }
}