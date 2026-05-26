using Microsoft.AspNetCore.Mvc;

namespace WealthPilot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RentalROICalculatorController : ControllerBase
{
    // POST: api/rentalroicalculator
    [HttpPost]
    public IActionResult CalculateRentalROI([FromBody] RentalROIRequest request)
    {
        if (request.PurchasePrice <= 0)
            return BadRequest("Purchase price must be greater than 0.");

        if (request.DownPayment < 0 || request.ClosingCosts < 0 || request.MonthlyRent < 0)
            return BadRequest("Money values cannot be negative.");

        var loanAmount = request.PurchasePrice - request.DownPayment;

        var monthlyExpenses =
            request.MonthlyMortgage +
            request.MonthlyPropertyTax +
            request.MonthlyInsurance +
            request.MonthlyHOA +
            request.MonthlyRepairs +
            request.MonthlyVacancyAllowance +
            request.MonthlyPropertyManagement;

        var monthlyCashFlow = request.MonthlyRent - monthlyExpenses;
        var annualCashFlow = monthlyCashFlow * 12;

        var annualGrossRent = request.MonthlyRent * 12;
        var annualOperatingExpenses =
            (request.MonthlyPropertyTax +
             request.MonthlyInsurance +
             request.MonthlyHOA +
             request.MonthlyRepairs +
             request.MonthlyVacancyAllowance +
             request.MonthlyPropertyManagement) * 12;

        var noi = annualGrossRent - annualOperatingExpenses;

        var capRate = noi / request.PurchasePrice * 100;

        var totalCashInvested = request.DownPayment + request.ClosingCosts;

        var cashOnCashReturn = totalCashInvested > 0
            ? annualCashFlow / totalCashInvested * 100
            : 0;

        return Ok(new RentalROIResponse
        {
            PurchasePrice = request.PurchasePrice,
            LoanAmount = loanAmount,
            MonthlyRent = request.MonthlyRent,
            MonthlyExpenses = monthlyExpenses,
            MonthlyCashFlow = monthlyCashFlow,
            AnnualCashFlow = annualCashFlow,
            NOI = noi,
            CapRate = Math.Round(capRate, 2),
            TotalCashInvested = totalCashInvested,
            CashOnCashReturn = Math.Round(cashOnCashReturn, 2)
        });
    }
}

public class RentalROIRequest
{
    public decimal PurchasePrice { get; set; }
    public decimal DownPayment { get; set; }
    public decimal ClosingCosts { get; set; }
    public decimal MonthlyRent { get; set; }
    public decimal MonthlyMortgage { get; set; }
    public decimal MonthlyPropertyTax { get; set; }
    public decimal MonthlyInsurance { get; set; }
    public decimal MonthlyHOA { get; set; }
    public decimal MonthlyRepairs { get; set; }
    public decimal MonthlyVacancyAllowance { get; set; }
    public decimal MonthlyPropertyManagement { get; set; }
}

public class RentalROIResponse
{
    public decimal PurchasePrice { get; set; }
    public decimal LoanAmount { get; set; }
    public decimal MonthlyRent { get; set; }
    public decimal MonthlyExpenses { get; set; }
    public decimal MonthlyCashFlow { get; set; }
    public decimal AnnualCashFlow { get; set; }
    public decimal NOI { get; set; }
    public decimal CapRate { get; set; }
    public decimal TotalCashInvested { get; set; }
    public decimal CashOnCashReturn { get; set; }
}