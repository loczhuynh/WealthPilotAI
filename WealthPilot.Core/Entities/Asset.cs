using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WealthPilot.Core.Entities;

public class Asset
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Name { get; set; } = "";
    public decimal Value { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
