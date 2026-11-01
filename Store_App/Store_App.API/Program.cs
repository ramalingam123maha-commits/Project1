using Store_App.Data;
using Store_App.Data.Repositories;
using Store_App.Services.Services;
using Store_App.Core.Entities;
using Serilog;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .WriteTo.Console()
    .WriteTo.File("logs/store-app-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register In-Memory Database
builder.Services.AddSingleton<InMemoryDatabase>(sp => InMemoryDatabase.GetInstance());

// Register Repositories
builder.Services.AddScoped<IRepository<User>>(sp => new UserRepository(sp.GetRequiredService<InMemoryDatabase>()));
builder.Services.AddScoped<IRepository<Product>>(sp => new ProductRepository(sp.GetRequiredService<InMemoryDatabase>()));
builder.Services.AddScoped<CartRepository>(sp => new CartRepository(sp.GetRequiredService<InMemoryDatabase>()));
builder.Services.AddScoped<OrderRepository>(sp => new OrderRepository(sp.GetRequiredService<InMemoryDatabase>()));

// Register Services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<ICartService, CartService>();
builder.Services.AddScoped<IOrderService, OrderService>();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", builder =>
    {
        builder.AllowAnyOrigin()
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowAll");
app.UseAuthorization();
app.MapControllers();

app.Run();
