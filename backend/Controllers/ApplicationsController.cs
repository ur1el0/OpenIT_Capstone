using System.Security.Claims;
using Kaagapay.Api.Dtos;
using Kaagapay.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Controllers;

[ApiController]
[Route("api/applications")]
[Authorize]
public class ApplicationsController : ControllerBase
{
    private readonly ApplicationService _service;
    private readonly StudentProfileService _students;

    public ApplicationsController(ApplicationService service, StudentProfileService students)
    {
        _service = service;
        _students = students;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ApplicationDto>>> GetAll([FromQuery] int? studentId, [FromQuery] int? scholarshipId)
    {
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            var student = await _students.GetByUserIdAsync(userId);
            if (student is null)
            {
                return Ok(Enumerable.Empty<ApplicationDto>());
            }
            studentId = student.Id;
        }

        var applications = await _service.GetAllAsync(studentId, scholarshipId);
        return Ok(applications.Select(a => a.ToDto()));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<ApplicationDto>> GetById(int id)
    {
        var application = await _service.GetByIdAsync(id);
        if (application is null)
        {
            return NotFound();
        }

        if (!User.IsInRole("Admin"))
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            var student = await _students.GetByUserIdAsync(userId);
            if (student is null || application.StudentId != student.Id)
            {
                return Forbid();
            }
        }

        return Ok(application.ToDto());
    }

    [HttpPost]
    public async Task<ActionResult<ApplicationDto>> Create([FromBody] ApplicationCreateDto dto)
    {
        var isAdmin = User.IsInRole("Admin");
        if (!isAdmin)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier) ?? string.Empty;
            var student = await _students.GetByUserIdAsync(userId);
            if (student is null)
            {
                return BadRequest(new { message = "Student profile is missing. Please complete your profile before applying." });
            }

            dto.StudentId = student.Id;
        }

        Application? created;
        try
        {
            created = await _service.CreateAsync(dto);
        }
        catch (InvalidOperationException ex)
        {
            return Conflict(new { message = ex.Message });
        }
        catch (ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        if (created is null)
        {
            return NotFound(new { message = "Student or scholarship not found." });
        }

        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created.ToDto());
    }

    [HttpPut("{id:int}/status")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult<ApplicationDto>> UpdateStatus(int id, [FromBody] ApplicationStatusUpdateDto dto)
    {
        Application? updated;
        try
        {
            updated = await _service.UpdateStatusAsync(id, dto);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { message = ex.Message });
        }

        if (updated is null)
        {
            return NotFound();
        }

        return Ok(updated.ToDto());
    }

    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(int id)
    {
        var removed = await _service.DeleteAsync(id);
        if (!removed)
        {
            return NotFound();
        }

        return NoContent();
    }
}
