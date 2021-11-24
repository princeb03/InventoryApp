using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.AccountDTOs;
using API.Entities;
using API.Interfaces;
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
    [AllowAnonymous]
    public class AccountsController: ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;
        public AccountsController(DataContext context, 
            UserManager<AppUser> userManager, 
            SignInManager<AppUser> signInManager,
            ITokenService tokenService,
            IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto newUser)
        {
            if (await _userManager.Users.AnyAsync(x => x.Email == newUser.Email))
            {
                return BadRequest("E-mail taken");
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName == newUser.Username))
            {
                return BadRequest("Username taken");
            }
            var user = new AppUser
            {
                Email = newUser.Email,
                DisplayName = newUser.DisplayName,
                UserName = newUser.Username
            };
            var result = await _userManager.CreateAsync(user, newUser.Password);
            if (result.Succeeded) return CreateUserDto(user);
            return BadRequest("Registration failed");
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDetails)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDetails.Email);
            if (user == null) 
            {
                return Unauthorized();
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDetails.Password, false);
            if (result.Succeeded) return CreateUserDto(user);
            return Unauthorized();
        }
        
        [HttpGet]
        public async Task<ActionResult<List<AppUser>>> GetAllUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpGet("current")]
        public async Task<ActionResult<UserDto>> GetCurrentUser() 
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            return CreateUserDto(currentUser);
        }

        private UserDto CreateUserDto(AppUser user)
        {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Email = user.Email,
                Token = _tokenService.CreateToken(user)
            };
        }
    }
}