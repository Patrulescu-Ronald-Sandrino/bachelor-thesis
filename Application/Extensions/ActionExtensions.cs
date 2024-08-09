namespace Application.Extensions;

public static class ActionExtensions
{
    public static async Task InvokeWithRetries(this Func<ushort, Task> @this, ushort retries, TimeSpan delay,
        double delayMultiplier = 1)
    {
        ushort retry = 0;
        var totalDelayMultiplier = delayMultiplier;

        while (retry <= retries)
            try
            {
                await @this.Invoke(retry);
                return;
            }
            catch
            {
                retry++;
                await Task.Delay(delay * totalDelayMultiplier);
                totalDelayMultiplier *= delayMultiplier;
            }
    }
}
