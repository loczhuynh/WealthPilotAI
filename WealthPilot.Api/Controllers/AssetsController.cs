using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AssetsController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public AssetsController(WealthPilotDbContext context)
    {
        _context = context;
    }

    // POST: api/assets
    [HttpPost]
    public async Task<IActionResult> CreateAsset([FromBody] Asset asset)
    {
        if (string.IsNullOrWhiteSpace(asset.Name))
        {
            return BadRequest("Asset name is required.");
        }

        if (asset.Value < 0)
        {
            return BadRequest("Asset value cannot be negative.");
        }

        _context.Assets.Add(asset);

        await _context.SaveChangesAsync();

        return Ok(asset);
    }

    // GET: api/assets/1
    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetAssets(int userId)
    {
        var assets = await _context.Assets
            .Where(x => x.UserId == userId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(assets);
    }

    // DELETE: api/assets/5
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteAsset(int id)
    {
        var asset = await _context.Assets.FindAsync(id);

        if (asset == null)
        {
            return NotFound();
        }

        _context.Assets.Remove(asset);

        await _context.SaveChangesAsync();

        return Ok("Asset deleted successfully.");
    }
}