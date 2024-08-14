using Microsoft.AspNetCore.Http;

namespace Application.Contracts.Infrastructure;

public interface IPhotoAccessor
{
    bool IsTooLarge(IFormFile photo);
    Task<List<string>> UploadPhotos(IFormFile[] photos);
    Task<string> UploadPhoto(IFormFile file);
    Task DeletePhotos(List<string> urls);
}
