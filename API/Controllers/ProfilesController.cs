using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs.ProfileDTOs;
using API.Entities;
using API.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
        [HttpGet("{id}")]
        public async Task<IActionResult> GetProfile(string id)
        {
            var user = await _userManager.Users
                .Include(u => u.Orders)
                .ThenInclude(o => o.OrderItems)
                .ThenInclude(o => o.Product)
                .FirstOrDefaultAsync(u => u.Id == id);
            if (user == null) return NotFound();
            var profile = _mapper.Map<ProfileDto>(user);

            return Ok(profile);
        }
    }
}