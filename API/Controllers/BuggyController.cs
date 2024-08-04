using Application.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[AllowAnonymous]
public class BuggyController : BaseApiController
{
    [HttpGet("not-found")]
    public ActionResult GetNotFound()
    {
        return NotFound();
    }

    [HttpGet("not-found/actual")]
    public ActionResult GetNotFoundActual()
    {
        throw new NotFoundException();
    }

    [HttpGet("bad-request")]
    public ActionResult GetBadRequest()
    {
        return BadRequest("This is a bad request");
    }

    [HttpGet("validation-error")]
    public ActionResult GetValidationError()
    {
        ModelState.AddModelError("Problem1", "This is the first error");
        ModelState.AddModelError("Problem2", "This is the second error");
        return ValidationProblem();
    }

    [HttpGet("validation-error/actual")]
    public ActionResult GetValidationErrorActual()
    {
        throw new ValidationException("One or more validation errors occurred.", new Dictionary<string, string[]>
        {
            { "Problem1", ["This is the first error", "This is the second error"] },
            { "Problem2", ["This is the third error", "This is the forth error"] }
        });
    }

    [HttpGet("server-error")]
    public ActionResult GetServerError()
    {
        throw new Exception("This is a server error");
    }
}
