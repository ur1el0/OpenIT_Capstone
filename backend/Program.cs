using System.Text;
using Kaagapay.Api.Data;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Npgsql;

AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

var builder = WebApplication.CreateBuilder(args);



builder.Services.AddDbContext<KaagapayContext>(options =>
{
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.ConfigureWarnings(warnings =>
        warnings.Ignore(Microsoft.EntityFrameworkCore.Diagnostics.RelationalEventId.PendingModelChangesWarning));
});

builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<BarangayService>();
builder.Services.AddScoped<StudentProfileService>();
builder.Services.AddScoped<ScholarshipService>();
builder.Services.AddScoped<ApplicationService>();
builder.Services.AddScoped<DocumentService>();
builder.Services.AddScoped<NotificationService>();
builder.Services.AddScoped<EligibilityService>();

builder.Services.AddHealthChecks();

builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

var jwtSection = builder.Configuration.GetSection("Jwt");
var jwtKey = jwtSection["Key"];
if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException("Jwt:Key is required.");
}

if (Encoding.UTF8.GetByteCount(jwtKey) <= 32)
{
    throw new InvalidOperationException("Jwt:Key must be longer than 32 bytes for HS256 signing.");
}

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey)),
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidIssuer = jwtSection["Issuer"],
            ValidAudience = jwtSection["Audience"],
            ValidateLifetime = true,
            ClockSkew = TimeSpan.FromMinutes(2)
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("DevCors", policy =>
    {
        policy.WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173",
                "http://localhost:3000",
                "http://localhost:5175",
                "http://127.0.0.1:5175",
                "http://127.0.0.1:3000",
                "paldos.vercel.app")
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<KaagapayContext>();
    try
    {
        await context.Database.MigrateAsync();
    }
    catch (PostgresException ex) when (ex.SqlState == "42P07")
    {
        // The table already exists but migration history is missing/out-of-sync.
        app.Logger.LogWarning("Skipping migration due to existing relation: {Message}", ex.MessageText);
    }
    await SeedData.EnsureSeededAsync(context);
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors("DevCors");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHealthChecks("/health");

app.Run();
