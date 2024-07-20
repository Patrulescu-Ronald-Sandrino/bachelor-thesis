using Microsoft.AspNetCore.Http;

namespace Application.Contracts.Infrastructure;

public interface IPhotoAccessor
{
    Task<List<string>> UploadPhotos(IFormFile[] photos);
    Task DeletePhotos(List<string> urls);
}
