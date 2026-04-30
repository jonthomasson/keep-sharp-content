---
id: csharp-fundamentals/architecture-controller-database-coupling
title: Diagnose tight coupling between controller and database
category: architecture
difficulty: advanced
language: csharp
framework: aspnet
topics: [architecture, patterns]
tags: [hexagonal, dependency-inversion]
starter:
  kind: single
  language: csharp
  code: |
    [ApiController]
    [Route("api/orders")]
    public class OrderController : ControllerBase
    {
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] OrderDto dto)
        {
            using var conn = new SqlConnection(Config.ConnectionString);
            await conn.OpenAsync();

            using var cmd = new SqlCommand(
                "INSERT INTO Orders (Id, CustomerId, Total) VALUES (@id, @cid, @total)",
                conn);
            cmd.Parameters.AddWithValue("@id", Guid.NewGuid());
            cmd.Parameters.AddWithValue("@cid", dto.CustomerId);
            cmd.Parameters.AddWithValue("@total", dto.Total);
            await cmd.ExecuteNonQueryAsync();

            return Ok();
        }
    }
expectedConcepts:
  - the action mixes HTTP transport, persistence, and implicit domain rules in one method — three responsibilities in one place
  - 'consequences: cannot unit-test Create without a real SQL Server, cannot swap stores without rewriting the controller, controller changes whenever schema changes'
  - 'standard fix: extract IOrderRepository in a domain or application layer and have an SqlOrderRepository implement it in infrastructure'
  - 'the controller is reduced to: bind dto, call repository (or an application handler), translate result to an HTTP response'
  - 'register the repository in Program.cs (services.AddScoped<IOrderRepository, SqlOrderRepository>()) — Scoped is appropriate for SQL connection lifetimes'
---

The action above mixes HTTP concerns, raw SQL, and (implicitly) domain logic in one method. In a layered or hexagonal architecture this is a classic coupling smell.

1. Identify the responsibilities tangled together and the **practical consequences** (testability, portability, rate of change).
2. Sketch a refactor showing: an `IOrderRepository` interface, a thin application handler (or service) class, and the rewritten controller. Pseudocode is fine — focus on the **shape** of the dependencies, not a runnable example.
3. Briefly note where you would register the repository in `Program.cs` and what DI lifetime is appropriate for a SQL-connection-using repo.
