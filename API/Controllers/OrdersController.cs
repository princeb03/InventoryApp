using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.OrderDTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Persistence;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController: ControllerBase
    {
        private readonly DataContext _context;
        private readonly UserManager<AppUser> _userManager;
        private readonly IMapper _mapper;
        public OrdersController(DataContext context, UserManager<AppUser> userManager, IMapper mapper)
        {
            _context = context;
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetAll([FromQuery] OrderParams orderParams)
        {
            var query = _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
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
            var orders = await query
                .OrderBy(o => o.OrderCreatedAt)
                .ToListAsync();
            var ordersToReturn = _mapper.Map<List<OrderDto>>(orders);
            Response.AddPaginationHeader(count, orderParams.PageSize, orderParams.PageNumber, totalPages);
            return Ok(ordersToReturn);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDto>> GetOrder(Guid id) 
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(o => o.Product)
                .ThenInclude(p => p.Photos)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound("Order not found.");
            if (order.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier)) return Unauthorized("Order does not belong to user.");
            var orderToReturn = _mapper.Map<OrderDto>(order);
            return Ok(orderToReturn);
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto createOrderDto)
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var newOrder = new Order {
                User = currentUser,
                OrderStatus = "In Use",
                OrderCreatedAt = DateTime.Now,
                Notes = createOrderDto.Notes
            };

            _context.Orders.Add(newOrder);
            if (!createOrderDto.OrderItems.Any()) return BadRequest("No items ordered.");

            foreach (var orderItem in createOrderDto.OrderItems)
            {
                var product = await _context.Inventory.FindAsync(orderItem.Product);
                if (product == null) return BadRequest("Attempted to order an item that does not exist.");
                if (orderItem.Quantity < 1) return BadRequest("Must order at least one unit of an item.");
                if (product.AvailableStock < orderItem.Quantity) return BadRequest("Attempted to order more than Available Stock.");
                product.AvailableStock -= orderItem.Quantity;
                var newOrderItem = new OrderItem
                {
                    Order = newOrder,
                    Product = product,
                    Quantity = orderItem.Quantity
                };
                newOrder.OrderItems.Add(newOrderItem);
            }
            
            var success = await _context.SaveChangesAsync() > 0;
            if (success)
            {
                return NoContent();
            }
            return BadRequest("Failed to create order.");
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(Guid id) 
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound("Order not found.");
            if (order.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier)) return Unauthorized("Order does not belong to user.");
            if (order.OrderStatus == "Completed") return BadRequest("Order already completed.");
            foreach (var orderItem in order.OrderItems)
            {
                var product = await _context.Inventory.FindAsync(orderItem.ProductId);
                product.AvailableStock += orderItem.Quantity;
            }
            order.OrderStatus = "Completed";
            order.OrderCompletedAt = DateTime.Now;
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return NoContent();
            return BadRequest("Failed to updated order status.");
        }
    }
}