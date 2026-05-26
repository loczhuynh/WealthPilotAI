using Microsoft.AspNetCore.Mvc;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FICalculatorController : ControllerBase
{
    // POST: api/ficalculator
    [HttpPost]
    public IActionResult CalculateFI([FromBody] FICalculatorRequest request)
    {
        if (request.CurrentNetWorth < 0)
            return BadRequest("Current net worth cannot be negative.");

        if (request.MonthlyInvestment <= 0)
            return BadRequest("Monthly investment must be greater than 0.");

        if (request.TargetAmount <= request.CurrentNetWorth)
            return BadRequest("Target amount must be greater than current net worth.");

        if (request.ExpectedAnnualReturn < 0)
            return BadRequest("Expected annual return cannot be negative.");

        var monthlyReturn = request.ExpectedAnnualReturn / 100 / 12;
        var balance = request.CurrentNetWorth;
        var months = 0;

        while (balance < request.TargetAmount && months < 1200)
        {
            balance = balance * (1 + monthlyReturn) + request.MonthlyInvestment;
            months++;
        }

        var years = months / 12;
        var remainingMonths = months % 12;

        return Ok(new FICalculatorResponse
        {
            CurrentNetWorth = request.CurrentNetWorth,
            MonthlyInvestment = request.MonthlyInvestment,
            ExpectedAnnualReturn = request.ExpectedAnnualReturn,
            TargetAmount = request.TargetAmount,
            MonthsToFI = months,
            YearsToFI = years,
            RemainingMonths = remainingMonths,
            EstimatedFinalBalance = Math.Round(balance, 2)
        });
    }
}

public class FICalculatorRequest
{
    public decimal CurrentNetWorth { get; set; }
    public decimal MonthlyInvestment { get; set; }
    public decimal ExpectedAnnualReturn { get; set; }
    public decimal TargetAmount { get; set; }
}

public class FICalculatorResponse
{
    public decimal CurrentNetWorth { get; set; }
    public decimal MonthlyInvestment { get; set; }
    public decimal ExpectedAnnualReturn { get; set; }
    public decimal TargetAmount { get; set; }
    public int MonthsToFI { get; set; }
    public int YearsToFI { get; set; }
    public int RemainingMonths { get; set; }
    public decimal EstimatedFinalBalance { get; set; }
}