using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Interfaces;
using API.Persistence;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PhotosController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly DataContext _context;
        private readonly IPhotoAccessor _photoAccessor;
        public PhotosController(UserManager<AppUser> userManager, 
            DataContext context,
            IPhotoAccessor photoAccessor
            )
        {
            _userManager = userManager;
            _context = context;
            _photoAccessor = photoAccessor;
        }
        [HttpPost("{itemId}")]
        public async Task<IActionResult> Add([FromForm] IFormFile File, Guid itemId)
        {
            var inventoryItem = await _context.Inventory.Include(i => i.Photos)
                .FirstOrDefaultAsync(i => i.Id == itemId);

            if (inventoryItem == null) return NotFound("Item not found.");

            var photoUploadResult = await _photoAccessor.AddPhoto(File);
            var photo = new Photo
            {
                Url = photoUploadResult.Url,
                Id = photoUploadResult.PublicId
            };

            if (!inventoryItem.Photos.Any(i => i.IsMain)) photo.IsMain = true;
            inventoryItem.Photos.Add(photo);

            var result = await _context.SaveChangesAsync() > 0;

            if (result) return Ok(photo);
            return BadRequest("Failed to add photo.");

        }

        [HttpDelete("{itemId}/{photoId}")]
        [Authorize(Policy = "isAdmin")]
        public async Task<IActionResult> Delete(Guid itemId, string photoId )
        {
            var inventoryItem = await _context.Inventory.Include(i => i.Photos).FirstOrDefaultAsync(i => i.Id == itemId);
            if (inventoryItem == null) return NotFound("Item not found.");

            var photo = inventoryItem.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return NotFound("Photo not found.");

            if (photo.IsMain) return BadRequest("Cannot delete main photo.");

            var result = await _photoAccessor.DeletePhoto(photo.Id);
            if (result == null) return BadRequest("Problem deleting photo.");

            inventoryItem.Photos.Remove(photo);

            var success = await _context.SaveChangesAsync() > 0;
            if (success) return NoContent();
            return BadRequest("Problem deleting photo.");
        }

        [HttpPost("{itemId}/{photoId}/setMain")]
        [Authorize(Policy = "isAdmin")]
        public async Task<IActionResult> SetMain(string photoId, Guid itemId)
        {
            var inventoryItem = await _context.Inventory.Include(i => i.Photos)
                .FirstOrDefaultAsync(i => i.Id == itemId);
            if (inventoryItem == null) return NotFound("Item not found.");

            var photo = inventoryItem.Photos.FirstOrDefault(p => p.Id == photoId);
            if (photo == null) return NotFound("Photo not found.");

            var currentMain = inventoryItem.Photos.FirstOrDefault(p => p.IsMain);
            if (currentMain != null) currentMain.IsMain = false;
            photo.IsMain = true;

            var success = await _context.SaveChangesAsync() > 0;
            if (success) return NoContent();
            return BadRequest("Problem setting main photo.");
        }
    }
}