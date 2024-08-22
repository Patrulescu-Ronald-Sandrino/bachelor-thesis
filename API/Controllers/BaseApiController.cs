using System.Net.Mime;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route(Route)]
[Produces(MediaTypeNames.Application.Json)]
public class BaseApiController : ControllerBase
{
    protected const string RoutePrefix = "api";
    protected const string Route = $"{RoutePrefix}/[controller]";
}
