using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class NetWorthSnapshotsController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public NetWorthSnapshotsController(WealthPilotDbContext context)
    {
        _context = context;
    }

    // POST: api/networthsnapshots/1
    [HttpPost("{userId:int}")]
    public async Task<IActionResult> CreateSnapshot(int userId)
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

        //var today = DateTime.UtcNow.Date;

        var startOfDay = DateTime.UtcNow.Date;
        var endOfDay = startOfDay.AddDays(1);

        var existingSnapshot = await _context.NetWorthSnapshots
            .FirstOrDefaultAsync(x =>
            x.UserId == userId &&
            x.SnapshotDate >= startOfDay &&
            x.SnapshotDate < endOfDay);

        if (existingSnapshot != null)
        {
            return Ok(existingSnapshot);
        }

        var snapshot = new NetWorthSnapshot
        {
            UserId = userId,
            TotalAssets = totalAssets,
            TotalDebts = totalDebts,
            StockValue = stockValue,
            NetWorth = netWorth,
            SnapshotDate = DateTime.UtcNow
        };

        _context.NetWorthSnapshots.Add(snapshot);

        await _context.SaveChangesAsync();

        return Ok(snapshot);
    }

    // GET: api/networthsnapshots/1
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetSnapshots(int userId)
    {
        var snapshots = await _context.NetWorthSnapshots
            .Where(x => x.UserId == userId)
            .OrderBy(x => x.SnapshotDate)
            .ToListAsync();

        return Ok(snapshots);
    }

    // DELETE: api/networthsnapshots/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteSnapshot(int id)
    {
        var snapshot = await _context.NetWorthSnapshots.FindAsync(id);

        if (snapshot == null)
            return NotFound();

        _context.NetWorthSnapshots.Remove(snapshot);
        await _context.SaveChangesAsync();

        return Ok("Snapshot deleted successfully.");
    }
}