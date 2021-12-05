using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.DTOs.InventoryItemDTOs;
using API.Entities;
using API.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class InventoryController: ControllerBase
    {
        private readonly DataContext _context;
        private readonly IMapper _mapper;
        public InventoryController(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll() 
        {
            var allItems = await _context.Inventory.Include(i => i.Photos).ToListAsync();
            var itemsToReturn = _mapper.Map<List<InventoryItemDto>>(allItems);
            return Ok(itemsToReturn);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(Guid id) 
        {
            var item = await _context.Inventory
                .Include(i => i.Orders)
                .Include(i => i.Photos)
                .FirstOrDefaultAsync(i => i.Id == id);
            if (item == null) return NotFound("Item not found.");
            var itemToReturn = _mapper.Map<ItemDetailsDto>(item);
            return Ok(itemToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateItem(CreateInventoryItemDto newItem)
        {
            var item = _mapper.Map<InventoryItem>(newItem);
            Console.WriteLine(item);
            _context.Inventory.Add(item);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateItem(CreateInventoryItemDto item, Guid id)
        {
            var itemToUpdate = await _context.Inventory.FindAsync(id);
            if (itemToUpdate == null) return NotFound("Item not found.");
            _mapper.Map(item, itemToUpdate);
            await _context.SaveChangesAsync();
            return NoContent();
        }

    }
}