using Application.Contracts.Infrastructure;
using Application.Logic.Extensions;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Photos;

public class PhotoAccessor : IPhotoAccessor
{
    private readonly Cloudinary _cloudinary;

    public PhotoAccessor(IOptions<CloudinarySettings> config)
    {
        var account = new Account(
            config.Value.CloudName,
            config.Value.ApiKey,
            config.Value.ApiSecret
        );
        _cloudinary = new Cloudinary(account);
    }


    public async Task<List<string>> UploadPhotos(IFormFile[] photos)
    {
        var (success, results, exceptions) = await TaskHelper.RunAsync(photos.Select(UploadPhoto).ToList());

        if (success) return results.Values.ToList();

        // log failed to upload photos
        Console.WriteLine("UploadPhotos Error:");
        foreach (var (index, exception) in exceptions)
            Console.WriteLine($"Failed to upload {index + 1}th photo: {exception.Message}");

        // try to delete uploaded photos
        await DeletePhotos(results.Values.ToList());

        throw new Exception("Failed to upload photos " + exceptions.Keys.Select(x => x + 1));
    }

    public async Task DeletePhotos(List<string> urls)
    {
        try
        {
            var errors = await DeletePhotosInner(urls);
            if (errors == null) return;
            Console.WriteLine("Failed to delete photos:");
            Console.WriteLine(errors);
        }
        catch (Exception e)
        {
            Console.WriteLine("Failed to run delete photos:");
            Console.WriteLine(e);
        }
    }

    private async Task<string> UploadPhoto(IFormFile file)
    {
        if (file.Length <= 0) return null;
        await using var stream = file.OpenReadStream();
        var uploadParams = new ImageUploadParams
        {
            File = new FileDescription(file.FileName, stream),
            Transformation = new Transformation().Height(500).Width(500).Crop("fill"),
        };

        var uploadResult = await _cloudinary.UploadAsync(uploadParams);

        if (uploadResult.Error != null) throw new Exception(uploadResult.Error.Message);

        return uploadResult.SecureUrl.ToString();
    }

    private async Task<string> DeletePhotosInner(List<string> urls)
    {
        var (success, results, exceptions) = await TaskHelper.RunAsync(urls.Select(DeletePhoto).ToList());
        if (success) return null;

        var failuresIndices = results.Where(pair => pair.Value == false).Select(p => p.Key)
            .Concat(exceptions.Keys).Order().ToArray();
        var messages = failuresIndices.Select(index =>
        {
            var reason = exceptions.TryGetValue(index, out var exception) ? exception.Message : "Cloudinary error";
            return $"Failed to delete {index + 1}th photo: {reason}. Maintainers should delete it!!!";
        });

        return messages.Aggregate("", (s, s1) => s + s1 + "\n");
    }

    private async Task<bool> DeletePhoto(string url)
    {
        var id = GetIdFromUrl(url);
        var deleteParams = new DeletionParams(id);
        var result = await _cloudinary.DestroyAsync(deleteParams);
        return result.Result == "ok";
    }

    private static string GetIdFromUrl(string url)
    {
        return url.Split("/").Last().Split(".").First();
    }
}
