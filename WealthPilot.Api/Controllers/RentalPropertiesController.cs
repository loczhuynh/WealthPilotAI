using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RentalPropertiesController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public RentalPropertiesController(WealthPilotDbContext context)
    {
        _context = context;
    }

    // POST: api/rentalproperties
    [HttpPost]
    public async Task<IActionResult> SaveRentalProperty([FromBody] RentalProperty property)
    {
        if (string.IsNullOrWhiteSpace(property.PropertyName))
            return BadRequest("Property name is required.");

        _context.RentalProperties.Add(property);
        await _context.SaveChangesAsync();

        return Ok(property);
    }

    // GET: api/rentalproperties/1
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetRentalProperties(int userId)
    {
        var properties = await _context.RentalProperties
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(properties);
    }

    // DELETE: api/rentalproperties/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteRentalProperty(int id)
    {
        var property = await _context.RentalProperties.FindAsync(id);

        if (property == null)
            return NotFound();

        _context.RentalProperties.Remove(property);
        await _context.SaveChangesAsync();

        return Ok("Rental property deleted successfully.");
    }
}