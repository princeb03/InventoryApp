using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs.OrderDTOs;
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
        public async Task<ActionResult<List<OrderDto>>> GetAll()
        {
            var orders = await _context.Orders
                .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
                .Include(o => o.User)
                .ToListAsync();

            var ordersToReturn = _mapper.Map<List<OrderDto>>(orders);
            return ordersToReturn;
        }

        [HttpPost]
        public async Task<IActionResult> CreateOrder(CreateOrderDto createOrderDto)
        {
            var currentUser = await _userManager.FindByIdAsync(User.FindFirstValue(ClaimTypes.NameIdentifier));
            var newOrder = new Order {
                User = currentUser,
                OrderStatus = "In Use",
                OrderCreatedAt = DateTime.Now
            };

            _context.Orders.Add(newOrder);

            foreach (var orderItem in createOrderDto.OrderItems)
            {
                var product = await _context.Inventory.FindAsync(orderItem.Product);
                if (product.AvailableStock < orderItem.Quantity) return BadRequest();
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
            return BadRequest();
        }

        [HttpPut("{id}/complete")]
        public async Task<IActionResult> CompleteOrder(Guid id) 
        {
            var order = await _context.Orders
                .Include(o => o.OrderItems)
                .FirstOrDefaultAsync(o => o.Id == id);
            if (order == null) return NotFound();
            if (order.UserId != User.FindFirstValue(ClaimTypes.NameIdentifier)) return Unauthorized();
            if (order.OrderStatus == "Completed") return BadRequest();
            foreach (var orderItem in order.OrderItems)
            {
                var product = await _context.Inventory.FindAsync(orderItem.ProductId);
                product.AvailableStock += orderItem.Quantity;
            }
            order.OrderStatus = "Completed";
            order.OrderCompletedAt = DateTime.Now;
            var result = await _context.SaveChangesAsync() > 0;
            if (result) return NoContent();
            return BadRequest();
        }
    }
}