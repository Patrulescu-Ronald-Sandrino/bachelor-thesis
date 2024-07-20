namespace Application.Logic.Extensions;

public static class TaskHelper
{
    public static async Task<(bool Success, Dictionary<int, TResult> Results, Dictionary<int, Exception> Exceptions)>
        RunAsync<TResult>(
            List<Task<TResult>> tasks)
    {
        var success = false;
        var results = new Dictionary<int, TResult>();
        var exceptions = new Dictionary<int, Exception>();

        try
        {
            var completedTasks = await Task.WhenAll(tasks);

            for (var i = 0; i < completedTasks.Length; i++) results.Add(i, completedTasks[i]);

            success = true;
        }
        catch
        {
            for (var i = 0; i < tasks.Count; i++)
            {
                if (tasks[i].IsCompletedSuccessfully) results.Add(i, tasks[i].Result);

                if (tasks[i].IsFaulted) exceptions.Add(i, tasks[i].Exception);
            }
        }

        return (success, results, exceptions);
    }
}
