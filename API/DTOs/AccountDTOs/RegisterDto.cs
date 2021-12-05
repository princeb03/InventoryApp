using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class RegisterDto
    {
        [Required(ErrorMessage = "Username required.")]
        public string Username { get; set; }
        [Required(ErrorMessage = "Display Name required.")]
        public string DisplayName { get; set; }
        [Required(ErrorMessage = "Password required.")]
        public string Password { get; set; }
        [Required(ErrorMessage = "E-mail required.")]
        [EmailAddress(ErrorMessage = "Invalid e-mail address.")]
        public string Email { get; set; }
    }
}