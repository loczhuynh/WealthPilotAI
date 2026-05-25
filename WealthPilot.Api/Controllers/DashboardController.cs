using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class DashboardController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public DashboardController(WealthPilotDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetDashboard(int userId)
    {
        var totalAssets = await _context.Assets
            .Where(x => x.UserId == userId)
            .SumAsync(x => x.Value);

        var totalDebts = await _context.Debts
            .Where(x => x.UserId == userId)
            .SumAsync(x => x.Amount);

        var stockValue = await _context.StockHoldings
            .Where(x => x.UserId == userId)
            .SumAsync(x => x.Shares * x.CurrentPrice);

        var netWorth = totalAssets + stockValue - totalDebts;

        return Ok(new
        {
            TotalAssets = totalAssets,
            TotalDebts = totalDebts,
            StockValue = stockValue,
            NetWorth = netWorth
        });
    }
}