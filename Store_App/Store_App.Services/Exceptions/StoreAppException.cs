namespace Store_App.Services.Exceptions;

/// <summary>
/// Custom exception for Store App business logic errors
/// </summary>
public class StoreAppException : Exception
{
    public string? Code { get; set; }
    public List<string> Details { get; set; } = new();

    public StoreAppException(string message, string? code = null, Exception? innerException = null)
        : base(message, innerException)
    {
        Code = code;
    }

    public StoreAppException(string message, List<string> details, string? code = null)
        : base(message)
    {
        Code = code;
        Details = details;
    }
}

/// <summary>
/// Exception thrown when a resource is not found
/// </summary>
public class ResourceNotFoundException : StoreAppException
{
    public ResourceNotFoundException(string resourceName, int id)
        : base($"{resourceName} with ID {id} not found", "RESOURCE_NOT_FOUND")
    {
    }
}

/// <summary>
/// Exception thrown when a business rule is violated
/// </summary>
public class BusinessRuleException : StoreAppException
{
    public BusinessRuleException(string message, string? code = null)
        : base(message, code ?? "BUSINESS_RULE_VIOLATION")
    {
    }
}

/// <summary>
/// Exception thrown when validation fails
/// </summary>
public class ValidationException : StoreAppException
{
    public ValidationException(string message, List<string> errors, string? code = null)
        : base(message, errors, code ?? "VALIDATION_ERROR")
    {
    }
}
