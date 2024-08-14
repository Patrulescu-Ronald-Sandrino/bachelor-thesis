using System.Net.Mime;
using System.Text;
using Microsoft.AspNetCore.Mvc.Formatters;

namespace API.Formatters;

public class StringInputFormatter : TextInputFormatter
{
    public StringInputFormatter()
    {
        SupportedMediaTypes.Add(MediaTypeNames.Text.Plain);
        SupportedEncodings.Add(Encoding.UTF8);
        SupportedEncodings.Add(Encoding.Unicode);
    }

    public override async Task<InputFormatterResult> ReadRequestBodyAsync(InputFormatterContext context,
        Encoding encoding)
    {
        var request = context.HttpContext.Request;
        using var reader = context.ReaderFactory(request.Body, encoding);
        var content = await reader.ReadToEndAsync();
        return await InputFormatterResult.SuccessAsync(content);
    }
}
