using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.OrderDTOs;
using API.DTOs.ProfileDTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "isUser")]
    public class ProfilesController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public ProfilesController(DataContext context, UserManager<AppUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username, [FromQuery] OrderParams orderParams)
        {
            
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return NotFound("User notfound.");
            if (user.Id != User.FindFirstValue(ClaimTypes.NameIdentifier) && !User.IsInRole("admin")) return Unauthorized();
            var query = _context.Orders
                .Where(o => o.UserId == user.Id)
                .Include(o => o.OrderItems)
                .ThenInclude(o => o.Product)
                .AsQueryable();

            if (orderParams.IsCompleted && !orderParams.IsInUse)
            {
                query = query.Where(o => o.OrderStatus == "Completed");
            }
            else if (orderParams.IsInUse && !orderParams.IsCompleted)
            {
                query = query.Where(o => o.OrderStatus == "In Use");
            }

            var count = await query.CountAsync();
            var totalPages = (int) Math.Ceiling(count / (double) orderParams.PageSize);
            var orders = await query.OrderByDescending(o => o.OrderCreatedAt)
                .Skip((orderParams.PageNumber - 1) * orderParams.PageSize)
                .Take(orderParams.PageSize)
                .ToListAsync();
            var ordersToReturn = _mapper.Map<List<OrderDto>>(orders);
            var profile = new ProfileDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Email = user.Email,
                Orders = ordersToReturn
            };
            Response.AddPaginationHeader(count, orderParams.PageSize, orderParams.PageNumber, totalPages);
            return Ok(profile);
        }
    }
}