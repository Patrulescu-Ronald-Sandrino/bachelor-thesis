using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class SystemController : BaseApiController
{
    [AllowAnonymous]
    [HttpOptions("status")]
    public ActionResult Status()
    {
        return Ok();
    }
}