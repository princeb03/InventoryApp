using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Identity;

namespace API.Persistence
{
    public class Seed
    {
        public static async Task SeedData(DataContext context, UserManager<AppUser> userManager)
        {
            if (!userManager.Users.Any())
            {
                var baseUser = new AppUser
                {
                    Email = "prince@test.com",
                    DisplayName = "prince display",
                    UserName = "princeusername"
                };

                await userManager.CreateAsync(baseUser, "Pa$$w0rd");
                await userManager.AddClaimAsync(baseUser, new Claim("role", "admin"));
                await context.SaveChangesAsync();
            }
        }
    }
}