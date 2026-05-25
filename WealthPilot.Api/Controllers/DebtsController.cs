using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DebtsController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public DebtsController(WealthPilotDbContext context)
    {
        _context = context;
    }

    // POST: api/debts
    [HttpPost]
    public async Task<IActionResult> CreateDebt([FromBody] Debt debt)
    {
        if (string.IsNullOrWhiteSpace(debt.Name))
        {
            return BadRequest("Debt name is required.");
        }

        if (debt.Amount < 0)
        {
            return BadRequest("Debt amount cannot be negative.");
        }

        _context.Debts.Add(debt);
        await _context.SaveChangesAsync();

        return Ok(debt);
    }

    // GET: api/debts/1
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetDebts(int userId)
    {
        var debts = await _context.Debts
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(debts);
    }

    // DELETE: api/debts/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteDebt(int id)
    {
        var debt = await _context.Debts.FindAsync(id);

        if (debt == null)
        {
            return NotFound();
        }

        _context.Debts.Remove(debt);
        await _context.SaveChangesAsync();

        return Ok("Debt deleted successfully.");
    }
}