using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Persistence;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController: ControllerBase
    {
        private readonly DataContext _context;
        public InventoryController(DataContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            return Ok(await _context.Inventory.ToListAsync());
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id) 
        {
            return Ok(await _context.Inventory.FindAsync(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem(InventoryItem newItem)
        {
            _context.Inventory.Add(newItem);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(InventoryItemDto item, Guid id)
        {
            var itemToUpdate = await _context.Inventory.FindAsync(id);
            itemToUpdate.ItemName = item.ItemName;
            itemToUpdate.ItemDescription = item.ItemDescription;
            itemToUpdate.TotalStock = item.TotalStock;

            await _context.SaveChangesAsync();
            
            return NoContent();
        }

    }
}