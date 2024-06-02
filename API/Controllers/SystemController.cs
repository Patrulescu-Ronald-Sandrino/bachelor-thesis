using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class SystemController : BaseApiController
{
    [HttpOptions]
    public ActionResult Status()
    {
        return Ok();
    }
}