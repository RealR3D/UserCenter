using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Text;
using System.Text.RegularExpressions;
using SiteServer.Plugin;
using SS.Home.Api;
using SS.Home.Core;
using SS.Home.Pages;
using SS.Home.Parse;
using SS.Home.Provider;

namespace SS.Home
{
    public class Main : PluginBase
    {
        public static Main Instance { get; private set; }

        public override void Startup(IService service)
        {
            Instance = this;

            var configInfo = Utils.GetConfigInfo();

            service
                .AddDatabaseTable(GroupDao.TableName, GroupDao.Columns)
                .AddDatabaseTable(GroupUserDao.TableName, GroupUserDao.Columns)
                .AddDatabaseTable(OAuthDao.TableName, OAuthDao.Columns)
                .AddDatabaseTable(MenuDao.TableName, MenuDao.Columns)
                .AddStlElementParser(StlHome.ElementName, StlHome.Parse)
                .AddPluginMenu(new Menu
                {
                    Text = "用户中心",
                    Href = configInfo.HomeUrl,
                    Target = "_blank",
                    Menus = new List<Menu>
                    {
                        new Menu
                        {
                            Text = "用户中心设置",
                            Href = $"{nameof(PageSettings)}.aspx"
                        },
                        new Menu
                        {
                            Text = "用户投稿设置",
                            Href = $"{nameof(PageWriting)}.aspx"
                        },
                        new Menu
                        {
                            Text = "扩展菜单设置",
                            Href = $"{nameof(PageMenu)}.aspx"
                        },
                        //new Menu
                        //{
                        //    Text = "进入用户中心",
                        //    Href = FilesApi.GetRootUrl("home"),
                        //    Target = "_blank"
                        //}
                    }
                })
                ;

            service.ApiGet += Service_ApiGet;
            service.ApiPost += Service_ApiPost;

            var homeDirectoryPath = Path.Combine(PhysicalApplicationPath, "home");
            var versionFilePath = Path.Combine(homeDirectoryPath, $"{Version}.txt");
            if (!Utils.IsDirectoryExists(homeDirectoryPath) || !Utils.IsFileExists(versionFilePath))
            {
                Utils.DeleteDirectoryIfExists(homeDirectoryPath);

                var distDirectoryPath = PluginApi.GetPluginPath("dist");
                Utils.CopyDirectory(distDirectoryPath, homeDirectoryPath, true);

                var indexHtml = Utils.ReadText(Path.Combine(distDirectoryPath, "index.html"), Encoding.UTF8);
                indexHtml= Regex.Replace(indexHtml, "domainAPI:\"[^\"]*\"", $@"domainAPI:""{PluginApi.GetPluginApiUrl()}""");

                Utils.WriteText(Path.Combine(homeDirectoryPath, "index.html"), indexHtml);

                Utils.WriteText(versionFilePath, DateTime.Now.ToString(CultureInfo.CurrentCulture));
            }
        }

        private object Service_ApiGet(object sender, ApiEventArgs args)
        {
            if (!string.IsNullOrEmpty(args.Action) && !string.IsNullOrEmpty(args.Id))
            {
                if (Utils.EqualsIgnoreCase(args.Action, nameof(ApiHttpGet.Captcha)))
                {
                    return ApiHttpGet.Captcha(args.Id);
                }
            }

            throw new Exception("请求的资源不在服务器上");
        }

        private static object Service_ApiPost(object sender, ApiEventArgs args)
        {
            if (!string.IsNullOrEmpty(args.Action) && Utils.EqualsIgnoreCase(args.Action, "actions") && !string.IsNullOrEmpty(args.Id))
            {
                var request = args.Request;
                var id = args.Id;

                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.LoadConfig)))
                {
                    return ApiJsonActionsPost.LoadConfig(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.Login)))
                {
                    return ApiJsonActionsPost.Login(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.Logout)))
                {
                    return ApiJsonActionsPost.Logout(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.ResetPassword)))
                {
                    return ApiJsonActionsPost.ResetPassword(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.ResetPasswordByToken)))
                {
                    return ApiJsonActionsPost.ResetPasswordByToken(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.Edit)))
                {
                    return ApiJsonActionsPost.Edit(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetLogs)))
                {
                    return ApiJsonActionsPost.GetLogs(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.IsMobileExists)))
                {
                    return ApiJsonActionsPost.IsMobileExists(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.IsPasswordCorrect)))
                {
                    return ApiJsonActionsPost.IsPasswordCorrect(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.IsCodeCorrect)))
                {
                    return ApiJsonActionsPost.IsCodeCorrect(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.SendSms)))
                {
                    return ApiJsonActionsPost.SendSms(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.SendSmsOrRegister)))
                {
                    return ApiJsonActionsPost.SendSmsOrRegister(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.RegisterWithCode)))
                {
                    return ApiJsonActionsPost.RegisterWithCode(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.CreateContent)))
                {
                    return ApiJsonActionsPost.CreateContent(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.DeleteContent)))
                {
                    return ApiJsonActionsPost.DeleteContent(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.EditContent)))
                {
                    return ApiJsonActionsPost.EditContent(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetContent)))
                {
                    return ApiJsonActionsPost.GetContent(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetContents)))
                {
                    return ApiJsonActionsPost.GetContents(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetChannels)))
                {
                    return ApiJsonActionsPost.GetChannels(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetSites)))
                {
                    return ApiJsonActionsPost.GetSites(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.GetTableColumns)))
                {
                    return ApiJsonActionsPost.GetTableColumns(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiJsonActionsPost.UploadAvatarResize)))
                {
                    return ApiJsonActionsPost.UploadAvatarResize(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiHttpActionsPost.UploadAvatar)))
                {
                    return ApiHttpActionsPost.UploadAvatar(request);
                }
                if (Utils.EqualsIgnoreCase(id, nameof(ApiHttpActionsPost.UploadSiteFiles)))
                {
                    return ApiHttpActionsPost.UploadSiteFiles(request);
                }
            }
            
            throw new Exception("请求的资源不在服务器上");
        }
    }
}