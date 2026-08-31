using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace MySlack.Infrastructure.Storage;

public class LocalFileStorageService
{
    private readonly string _uploadDirectory;
    private static readonly string[] AllowedExtensions = { ".png", ".jpg", ".jpeg", ".gif", ".pdf", ".txt", ".zip", ".cs", ".json" };
    private const long MaxFileSizeBytes = 10 * 1024 * 1024; // 10 MB limit

    public LocalFileStorageService(string rootPath)
    {
        _uploadDirectory = Path.Combine(rootPath, "uploads");
        if (!Directory.Exists(_uploadDirectory))
        {
            Directory.CreateDirectory(_uploadDirectory);
        }
    }

    public async Task<(string fileUrl, string fileName, long sizeBytes)> SaveFileAsync(IFormFile file)
    {
        if (file == null || file.Length == 0)
            throw new ArgumentException("File is empty.");

        if (file.Length > MaxFileSizeBytes)
            throw new InvalidOperationException("File size exceeds 10MB limit.");

        var extension = Path.GetExtension(file.FileName).ToLower();
        if (!AllowedExtensions.Contains(extension))
            throw new InvalidOperationException($"File type '{extension}' is not permitted.");

        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(file.FileName)}";
        var filePath = Path.Combine(_uploadDirectory, uniqueFileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }

        var fileUrl = $"/uploads/{uniqueFileName}";
        return (fileUrl, file.FileName, file.Length);
    }
}
