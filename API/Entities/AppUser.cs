using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class AppUser: IdentityUser
    {
        [Required(ErrorMessage = "Display Name required.")]
        public string DisplayName { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}