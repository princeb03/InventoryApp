using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class BuggyController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;

        public BuggyController(UserManager<AppUser> userManager)
        {
            _userManager = userManager;
        }

        [HttpGet("not-found")]
        public ActionResult GetNotFound()
        {
            return NotFound("This is not found");
        }

        [HttpGet("bad-request")]
        public ActionResult GetBadRequest()
        {
            return BadRequest("this is bad request");
        }

        [HttpGet("server-error")]
        public ActionResult GetServerError()
        {
            throw new Exception("This is a server error");
        }

        [HttpGet("unauthorised")]
        public ActionResult GetUnauthorised()
        {
            return Unauthorized("Not allowed here");
        }

        [HttpPost("removeclaim")]
        public async Task<IActionResult> RemoveClaims()
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == User.FindFirstValue(ClaimTypes.NameIdentifier));
            if (user == null) return NotFound();
            await _userManager.AddClaimAsync(user, new Claim("role", "admin"));
            var currentClaims = await _userManager.GetClaimsAsync(user);
            return Ok(currentClaims);
        }

        // [Authorize(Policy = "isUser")]
        // [HttpGet("checkrole")]
        // public async Task<IActionResult> CheckRole()
        // {
        //     if (User.IsInRole("admin")) return Ok("admin");
        //     return Ok("just user");

        // }
    }
}