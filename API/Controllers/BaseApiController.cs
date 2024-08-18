using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route($"{RoutePrefix}/[controller]")]
[Produces(MediaTypeNames.Application.Json)]
public class BaseApiController : ControllerBase
{
    protected const string RoutePrefix = "api";
}
