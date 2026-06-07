using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WealthPilot.Core.Entities;

public class RentalProperty
{
    public int Id { get; set; }
    public int UserId { get; set; } = 1;

    public string PropertyName { get; set; } = "";

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

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
