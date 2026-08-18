using System;
using Kaagapay.Api.Models;

namespace Kaagapay.Api.Dtos;

public class ApplicationDto
{
    public int Id { get; set; }
    public int ScholarshipId { get; set; }
    public int StudentId { get; set; }
    public ApplicationStatus Status { get; set; }
    public DateTime SubmittedAt { get; set; }
    public DateTime? ReviewedAt { get; set; }
    public string? Remarks { get; set; }
    public string? StudentName { get; set; }
    public string? ScholarshipName { get; set; }
    public string? Provider { get; set; }
    public string? Amount { get; set; }
    public string? DateApplied { get; set; }
    public string? Gpa { get; set; }
    public string? Course { get; set; }
    public string[]? Requirements { get; set; }
}

public class ApplicationCreateDto
{
    public int ScholarshipId { get; set; }
    public int StudentId { get; set; }
}

public class ApplicationStatusUpdateDto
{
    public ApplicationStatus Status { get; set; }
    public string? Remarks { get; set; }
}
