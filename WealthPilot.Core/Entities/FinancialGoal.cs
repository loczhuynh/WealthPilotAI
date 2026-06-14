using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WealthPilot.Core.Entities;

public class FinancialGoal
{
    public int Id { get; set; }
    public int UserId { get; set; }

    public decimal AnnualExpense { get; set; }
    public decimal MonthlyInvestment { get; set; }
    public decimal ExpectedAnnualReturn { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
