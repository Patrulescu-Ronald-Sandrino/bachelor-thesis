using Microsoft.AspNetCore.Http;

namespace Application.Contracts.Infrastructure;

public interface IPhotoAccessor
{
    bool IsTooLarge(IFormFile photo);
    Task<List<string>> UploadPhotos(IFormFile[] photos);
    Task DeletePhotos(List<string> urls);
}
