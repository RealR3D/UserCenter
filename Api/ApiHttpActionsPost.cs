using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Text;
using System.Web;
using SiteServer.Plugin;
using SS.Home.Core;

namespace SS.Home.Api
{
    public static class ApiHttpActionsPost
    {
        public static HttpResponseMessage UploadAvatar(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var avatarUrl = string.Empty;
            var relatedUrl = string.Empty;
            var errorMessage = string.Empty;

            if (HttpContext.Current.Request.Files.Count > 0)
            {
                try
                {
                    var postedFile = HttpContext.Current.Request.Files[0];
                    var filePath = postedFile.FileName;
                    var fileExtName = Path.GetExtension(filePath).ToLower();

                    var dt = DateTime.Now;
                    relatedUrl =
                        $"upload/{dt.Year}-{dt.Month}-{dt.Day}/{dt.Hour}{dt.Minute}{dt.Second}{dt.Millisecond}{fileExtName}";
                    var uploadFilePath = Main.Instance.PluginApi.GetPluginPath(relatedUrl);

                    const string extendType = ".jpg|.png|.gif|.jpeg|";
                    if (extendType.IndexOf(fileExtName, StringComparison.Ordinal) != -1)
                    {
                        postedFile.SaveAs(uploadFilePath);
                        avatarUrl = Main.Instance.PluginApi.GetPluginUrl(relatedUrl);
                    }
                }
                catch (Exception ex)
                {
                    errorMessage = ex.Message;
                }
            }

            var builder = new StringBuilder();
            if (!string.IsNullOrEmpty(avatarUrl))
            {
                builder.Append("{\"avatarUrl\":\"" + avatarUrl + "\", \"relatedUrl\":\"" + relatedUrl + "\"}");
            }
            else
            {
                builder.Append("{\"errorMessage\":\"");
                builder.Append(!string.IsNullOrEmpty(errorMessage) ? errorMessage : "未知错误");
                builder.Append("\"}");
            }

            var resp = new HttpResponseMessage(System.Net.HttpStatusCode.OK)
            {
                Content = !string.IsNullOrEmpty(HttpContext.Current.Request.Headers.Get("X-Access-Token"))
                    ? new StringContent(builder.ToString(), Encoding.UTF8, "application/json")
                    : new StringContent(builder.ToString(), Encoding.UTF8, "text/plain")
            };

            return resp;
        }

        public static HttpResponseMessage UploadSiteFiles(IRequest context)
        {
            if (!context.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = Convert.ToInt32(context.GetQueryString("siteId"));
            var uploadType = context.GetQueryString("uploadType");

            var errorMessage = string.Empty;
            var fileUrls = new List<string>();
            var siteInfo = Main.Instance.SiteApi.GetSiteInfo(siteId);
            if ( siteInfo != null)
            {
                try
                {
                    if (HttpContext.Current.Request.Files.Count > 0)
                    {
                        for (var i = 0; i < HttpContext.Current.Request.Files.Count; i++)
                        {
                            var postedFile = HttpContext.Current.Request.Files[i];
                            var filePath = postedFile.FileName;
                            var fileExtName = Path.GetExtension(filePath).ToLower();
                            var localFilePath = Main.Instance.FilesApi.GetUploadFilePath(siteId, postedFile.FileName);

                            if (Utils.EqualsIgnoreCase(uploadType, "image"))
                            {
                                if (!Utils.IsImageExtenstionAllowed(siteInfo, fileExtName))
                                {
                                    errorMessage = "上传图片格式不正确！";
                                    break;
                                }
                                if (!Utils.IsImageSizeAllowed(siteInfo, postedFile.ContentLength))
                                {
                                    errorMessage = "上传失败，上传图片超出规定文件大小！";
                                    break;
                                }

                                postedFile.SaveAs(localFilePath);
                                Main.Instance.FilesApi.AddWaterMark(siteId, localFilePath);
                                var imageUrl = Main.Instance.FilesApi.GetSiteUrlByFilePath(localFilePath);
                                fileUrls.Add(imageUrl);
                            }
                            else if (Utils.EqualsIgnoreCase(uploadType, "video"))
                            {
                                if (!Utils.IsVideoExtenstionAllowed(siteInfo, fileExtName))
                                {
                                    errorMessage = "上传视频格式不正确！";
                                    break;
                                }
                                if (!Utils.IsVideoSizeAllowed(siteInfo, postedFile.ContentLength))
                                {
                                    errorMessage = "上传失败，上传视频超出规定文件大小！";
                                    break;
                                }
                                postedFile.SaveAs(localFilePath);
                                var videoUrl = Main.Instance.FilesApi.GetSiteUrlByFilePath(localFilePath);
                                fileUrls.Add(videoUrl);
                            }
                            else if (Utils.EqualsIgnoreCase(uploadType, "file"))
                            {
                                if (!Utils.IsFileExtenstionAllowed(siteInfo, fileExtName))
                                {
                                    errorMessage = "此格式不允许上传，请选择有效的文件！";
                                    break;
                                }
                                if (!Utils.IsFileSizeAllowed(siteInfo, postedFile.ContentLength))
                                {
                                    errorMessage = "上传失败，上传文件超出规定文件大小！";
                                    break;
                                }
                                postedFile.SaveAs(localFilePath);
                                var fileUrl = Main.Instance.FilesApi.GetSiteUrlByFilePath(localFilePath);
                                fileUrls.Add(fileUrl);
                            }
                        }
                    }
                }
                catch (Exception ex)
                {
                    errorMessage = ex.Message;
                }
            }

            var builder = new StringBuilder();
            if (fileUrls.Count == 0)
            {
                builder.Append("{\"errorMessage\":\"");
                builder.Append(!string.IsNullOrEmpty(errorMessage) ? errorMessage : "未知错误");
                builder.Append("\"}");
            }
            else
            {

                builder.Append("{\"fileUrls\":[");
                foreach (var fileUrl in fileUrls)
                {
                    builder.Append("\"");
                    builder.Append(fileUrl);
                    builder.Append("\",");
                }
                builder.Length--;
                builder.Append("]}");
            }

            var resp = new HttpResponseMessage();
            if (!string.IsNullOrEmpty(HttpContext.Current.Request.Headers.Get("X-Access-Token")))
            {
                resp.Content = new StringContent(builder.ToString(), Encoding.UTF8, "application/json");
            }
            else
            {
                resp.Content = new StringContent(builder.ToString(), Encoding.UTF8, "text/plain");
            }

            return resp;
        }
    }
}
