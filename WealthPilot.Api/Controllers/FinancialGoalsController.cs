using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WealthPilot.Core.Entities;
using WealthPilot.Infrastructure.Data;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FinancialGoalsController : ControllerBase
{
    private readonly WealthPilotDbContext _context;

    public FinancialGoalsController(WealthPilotDbContext context)
    {
        _context = context;
    }

    [HttpGet("{userId:int}")]
    public async Task<IActionResult> GetGoal(int userId)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x => x.UserId == userId);

        if (goal == null)
        {
            goal = new FinancialGoal
            {
                UserId = userId,
                AnnualExpense = 72000,
                MonthlyInvestment = 2000,
                ExpectedAnnualReturn = 8
            };

            _context.FinancialGoals.Add(goal);
            await _context.SaveChangesAsync();
        }

        return Ok(new
        {
            goal.Id,
            goal.UserId,
            goal.AnnualExpense,
            goal.MonthlyInvestment,
            goal.ExpectedAnnualReturn,
            FiTarget = goal.AnnualExpense * 25
        });
    }

    [HttpPost]
    public async Task<IActionResult> SaveGoal([FromBody] FinancialGoal request)
    {
        var goal = await _context.FinancialGoals
            .FirstOrDefaultAsync(x => x.UserId == request.UserId);

        if (goal == null)
        {
            goal = new FinancialGoal
            {
                UserId = request.UserId,
                AnnualExpense = request.AnnualExpense,
                MonthlyInvestment = request.MonthlyInvestment,
                ExpectedAnnualReturn = request.ExpectedAnnualReturn
            };

            _context.FinancialGoals.Add(goal);
        }
        else
        {
            goal.AnnualExpense = request.AnnualExpense;
            goal.MonthlyInvestment = request.MonthlyInvestment;
            goal.ExpectedAnnualReturn = request.ExpectedAnnualReturn;
        }

        await _context.SaveChangesAsync();

        return Ok(new
        {
            goal.Id,
            goal.UserId,
            goal.AnnualExpense,
            goal.MonthlyInvestment,
            goal.ExpectedAnnualReturn,
            FiTarget = goal.AnnualExpense * 25
        });
    }
}