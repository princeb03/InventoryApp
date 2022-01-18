using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.AccountDTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using API.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Policy = "isAdmin")]
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
                return BadRequest("E-mail taken.");
            }
            if (await _userManager.Users.AnyAsync(x => x.UserName == newUser.Username))
            {
                return BadRequest("Username taken.");
            }
            var user = new AppUser
            {
                Email = newUser.Email,
                DisplayName = newUser.DisplayName,
                UserName = newUser.Username
            };
            var result = await _userManager.CreateAsync(user, newUser.Password);
            if (result.Succeeded) return NoContent();
            return BadRequest("Registration failed.");
        }

        [HttpPut("{username}")]
        public async Task<IActionResult> EditUser(string username, [FromBody] RegisterDto updatedDetails)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            user.UserName = updatedDetails.Username;
            user.Email = updatedDetails.Email;
            user.DisplayName = updatedDetails.DisplayName;
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return Ok(updatedDetails.Username);
            return BadRequest("Problem updating user details.");
        }

        [HttpPut("{username}/changePassword")]
        public async Task<IActionResult> ChangePassword(string username, [FromBody] string newPassword)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.UserName == username);
            if (user == null)
            {
                return NotFound("User not found.");
            }
            var token = await _userManager.GeneratePasswordResetTokenAsync(user);
            var result = await _userManager.ResetPasswordAsync(user, token, newPassword);
            if (result.Succeeded) return NoContent();
            return BadRequest("Problem changing password.");
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDetails)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(x => x.Email == loginDetails.Email);
            if (user == null) 
            {
                return Unauthorized("Incorrect e-mail/password.");
            }
            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDetails.Password, false);
            if (result.Succeeded) return await CreateUserDto(user);
            return Unauthorized("Incorrect e-mail/password.");
        }

        [AllowAnonymous]
        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser() 
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (currentUser == null) return NoContent();
            return Ok(await CreateUserDto(currentUser));
        }
        
        [HttpGet]
        public async Task<IActionResult> GetAllUsers([FromQuery] ProfileParams pagingParams)
        {
            var query = _userManager.Users.OrderBy(u => u.DisplayName.ToLower()).AsQueryable();

            if (!String.IsNullOrWhiteSpace(pagingParams.SearchString)) 
            {
                query = query.Where(u => u.DisplayName.ToLower().Contains(pagingParams.SearchString.Trim().ToLower()));
            }

            var count = await query.CountAsync();
            var totalPages = (int) Math.Ceiling(count/(double)pagingParams.PageSize);
            var users = await query
                .Skip((pagingParams.PageNumber - 1) * pagingParams.PageSize)
                .Take(pagingParams.PageSize)
                .ToListAsync();
            Response.AddPaginationHeader(count, pagingParams.PageSize, pagingParams.PageNumber, totalPages);
            var usersToReturn = _mapper.Map<List<UserDto>>(users);
            return Ok(usersToReturn);
        }

        [HttpPost("{username}/makeAdmin")]
        public async Task<IActionResult> MakeAdmin(string username)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return NotFound();
        
            await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
            return NoContent();
        }

        [HttpPost("{username}/removeAdmin")]
        public async Task<IActionResult> RemoveAdmin(string username)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (user == null) return NotFound();

            await _userManager.RemoveClaimAsync(user, new Claim("role", "admin"));
            return NoContent();
        }

        [HttpDelete("{username}")]
        public async Task<IActionResult> DeleteUser(string username)
        {
            var userToDelete = await _userManager.Users.FirstOrDefaultAsync(u => u.UserName == username);
            if (userToDelete == null) return NotFound();
            var result = await _userManager.DeleteAsync(userToDelete);
            if (result.Succeeded) return NoContent();
            return BadRequest("Problem deleting user.");
        }

        private async Task<UserDto> CreateUserDto(AppUser user)
        {
            var userClaims = await _userManager.GetClaimsAsync(user);
            
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Username = user.UserName,
                Email = user.Email,
                Token = await _tokenService.CreateToken(user),
                Role = userClaims.FirstOrDefault(c => c.Type == "role")?.Value
            };
        }
    }
}