using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StockHoldingsController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public StockHoldingsController(WealthPilotDbContext context)
    {
        _context = context;
    }

    // POST: api/stockholdings
    [HttpPost]
    public async Task<IActionResult> CreateStockHolding([FromBody] StockHolding stock)
    {
        if (string.IsNullOrWhiteSpace(stock.Ticker))
        {
            return BadRequest("Ticker is required.");
        }

        if (stock.Shares <= 0)
        {
            return BadRequest("Shares must be greater than 0.");
        }

        if (stock.AvgCost < 0 || stock.CurrentPrice < 0)
        {
            return BadRequest("Cost and current price cannot be negative.");
        }

        stock.Ticker = stock.Ticker.ToUpper();

        _context.StockHoldings.Add(stock);
        await _context.SaveChangesAsync();

        return Ok(stock);
    }

    // GET: api/stockholdings/1
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetStockHoldings(int userId)
    {
        var stocks = await _context.StockHoldings
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.Ticker)
            .Select(x => new
            {
                x.Id,
                x.UserId,
                x.Ticker,
                x.Shares,
                x.AvgCost,
                x.CurrentPrice,
                TotalCost = x.Shares * x.AvgCost,
                CurrentValue = x.Shares * x.CurrentPrice,
                GainLoss = (x.Shares * x.CurrentPrice) - (x.Shares * x.AvgCost),
                GainLossPercent = x.AvgCost > 0
                    ? ((x.CurrentPrice - x.AvgCost) / x.AvgCost) * 100
                    : 0
            })
            .ToListAsync();

        return Ok(stocks);
    }

    // PUT: api/stockholdings/5
    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateStockHolding(int id, [FromBody] StockHolding updatedStock)
    {
        var stock = await _context.StockHoldings.FindAsync(id);

        if (stock == null)
        {
            return NotFound();
        }

        stock.Ticker = updatedStock.Ticker.ToUpper();
        stock.Shares = updatedStock.Shares;
        stock.AvgCost = updatedStock.AvgCost;
        stock.CurrentPrice = updatedStock.CurrentPrice;

        await _context.SaveChangesAsync();

        return Ok(stock);
    }

    // DELETE: api/stockholdings/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteStockHolding(int id)
    {
        var stock = await _context.StockHoldings.FindAsync(id);

        if (stock == null)
        {
            return NotFound();
        }

        _context.StockHoldings.Remove(stock);
        await _context.SaveChangesAsync();

        return Ok("Stock holding deleted successfully.");
    }
}