namespace Store_App.API.Middleware;

using Store_App.Core.DTOs;
using Store_App.Services.Exceptions;
using System.Net;
using System.Text.Json;

/// <summary>
/// Middleware for handling exceptions and returning standardized error responses
/// </summary>
public class ExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(RequestDelegate next, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception has occurred: {ExceptionMessage}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = new ApiResponse();
        var statusCode = HttpStatusCode.InternalServerError;

        switch (exception)
        {
            case ResourceNotFoundException ex:
                statusCode = HttpStatusCode.NotFound;
                response = ApiResponse.ErrorResponse(ex.Message, ex.Details);
                break;

            case ValidationException ex:
                statusCode = HttpStatusCode.BadRequest;
                response = ApiResponse.ErrorResponse(ex.Message, ex.Details);
                break;

            case BusinessRuleException ex:
                statusCode = HttpStatusCode.BadRequest;
                response = new ApiResponse
                {
                    Success = false,
                    Message = ex.Message,
                    Errors = new List<string> { ex.Code ?? "BUSINESS_RULE_VIOLATION" }
                };
                break;

            default:
                response = ApiResponse.ErrorResponse("An internal server error occurred");
                break;
        }

        context.Response.StatusCode = (int)statusCode;
        return context.Response.WriteAsJsonAsync(response);
    }
}
