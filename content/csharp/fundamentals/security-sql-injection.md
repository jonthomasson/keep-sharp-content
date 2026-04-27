---
id: csharp-fundamentals/security-sql-injection
title: 'Identify the security issue: SQL injection in ADO.NET'
category: security
difficulty: intermediate
language: csharp
topics: [security, fundamentals]
tags: [sql-injection, ado-net]
expectedConcepts:
  - the email value is concatenated into the SQL string verbatim — classic SQL injection
  - an attacker submits an email like `' OR '1'='1` and the query returns every row
  - more dangerous payloads can drop tables, exfiltrate data, or chain statements
  - the fix is parameterized queries — SqlCommand.Parameters.AddWithValue (or, better, .Add with an explicit SqlDbType + Size)
  - never trust user input concatenated into a SQL string, even if the input "looks safe"
starter:
  kind: single
  language: csharp
  code: |
    public User? FindUserByEmail(string email)
    {
        using var connection = new SqlConnection(_connectionString);
        connection.Open();

        var sql = "SELECT Id, Name FROM Users WHERE Email = '" + email + "'";
        using var command = new SqlCommand(sql, connection);

        using var reader = command.ExecuteReader();
        if (!reader.Read()) return null;
        return new User(reader.GetGuid(0), reader.GetString(1));
    }
---

The method above looks up a user by email and is vulnerable to a classic, well-known attack.

1. Name the vulnerability.
2. Provide a concrete attack payload (a string that an attacker could submit as `email`) and describe the resulting query and what it returns.
3. Rewrite `FindUserByEmail` to be safe. Prefer `.Parameters.Add(...)` with an explicit type and size over `AddWithValue`, and explain in one sentence why.
