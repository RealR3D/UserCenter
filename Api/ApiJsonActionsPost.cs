using System;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Drawing;
using System.Drawing.Imaging;
using System.IO;
using System.Text;
using Newtonsoft.Json.Linq;
using SiteServer.Plugin;
using SS.Home.Core;
using SS.Home.Model;
using SS.Home.Provider;
using SS.Login;
using SS.Login.Models;
using SS.SMS;

namespace SS.Home.Api
{
    public static class ApiJsonActionsPost
    {
        private static string GetSendSmsCacheKey(string mobile)
        {
            return $"SS.Home.Api.ActionsPost.SendSms.{mobile}.Code";
        }

        public static object LoadConfig(IRequest request)
        {
            var dict = new Dictionary<string, List<MenuInfo>>();
            foreach (var parentInfo in MenuDao.GetMenuInfoList(0))
            {
                dict.Add(parentInfo.Title, MenuDao.GetMenuInfoList(parentInfo.Id));
            }
            var systemConfig = Main.Instance.ConfigApi.SystemConfig;
            var homeConfig = Utils.GetConfigInfo();

            var user = Main.Instance.UserApi.GetUserInfoByUserName(request.UserName);
            var group = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ??
                        Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());

            var weiboUrl = string.Empty;
            var weixinUrl = string.Empty;
            var qqUrl = string.Empty;

            var loginPlugin = Main.Instance.PluginApi.GetPlugin<LoginPlugin>(LoginPlugin.PluginId);
            if (loginPlugin != null)
            {
                if (loginPlugin.IsOAuthReady(OAuthType.Weibo))
                {
                    weiboUrl = loginPlugin.GetOAuthLoginUrl(OAuthType.Weibo, string.Empty);
                }
                if (loginPlugin.IsOAuthReady(OAuthType.Weixin))
                {
                    weixinUrl = loginPlugin.GetOAuthLoginUrl(OAuthType.Weixin, string.Empty);
                }
                if (loginPlugin.IsOAuthReady(OAuthType.Qq))
                {
                    qqUrl = loginPlugin.GetOAuthLoginUrl(OAuthType.Qq, string.Empty);
                }
            }

            return new
            {
                IsUserRegistrationAllowed = systemConfig.GetBool(SystemConfigAttribute.IsUserRegistrationAllowed),
                IsUserFindPassword = systemConfig.GetBool(SystemConfigAttribute.IsUserFindPassword),
                homeConfig.HomeUrl,
                homeConfig.Title,
                homeConfig.Copyright,
                homeConfig.BeianNo,
                homeConfig.LogoUrl,
                homeConfig.DefaultAvatarUrl,
                weiboUrl,
                weixinUrl,
                qqUrl,
                Menus = dict,
                User = user,
                Group = group
            };
        }

        public static object Login(IRequest request)
        {
            var account = request.GetPostString("account");
            var password = request.GetPostString("password");

            string userName;
            string errorMessage;
            if (!Main.Instance.UserApi.Validate(account, password, out userName, out errorMessage))
            {
                Main.Instance.UserApi.UpdateLastActivityDateAndCountOfFailedLogin(userName);
                throw new Exception(errorMessage);
            }

            Main.Instance.UserApi.UpdateLastActivityDateAndCountOfLogin(userName);
            var user = Main.Instance.UserApi.GetUserInfoByUserName(userName);
            var group = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(user.UserName)) ??
                        Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());

            request.UserLogin(userName);

            return new
            {
                User = user,
                Group = group
            };
        }

        public static object Logout(IRequest request)
        {
            request.UserLogout();
            return new {};
        }

        public static object ResetPassword(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户未登录");
            }

            var password = request.GetPostString("password");
            var newPassword = request.GetPostString("newPassword");
            var confirmPassword = request.GetPostString("confirmPassword");

            string userName;
            string errorMessage;
            if (newPassword != confirmPassword)
            {
                throw new Exception("确认密码与新密码不一致，请重新输入");
            }
            if (string.IsNullOrEmpty(password) || !Main.Instance.UserApi.Validate(request.UserName, password, out userName, out errorMessage))
            {
                throw new Exception("原密码输入错误，请重新输入");
            }
            if (password == newPassword)
            {
                throw new Exception("新密码不能与原密码一致，请重新输入");
            }

            if (Main.Instance.UserApi.ChangePassword(request.UserName, newPassword, out errorMessage))
            {
                return new
                {
                    LastResetPasswordDate = DateTime.Now
                };
            }

            throw new Exception(errorMessage);
        }

        public static object ResetPasswordByToken(IRequest request)
        {
            var token = request.GetPostString("token");
            var password = request.GetPostString("password");

            var userName = request.GetUserNameByToken(token);
            if (string.IsNullOrEmpty(userName))
            {
                throw new Exception("用户认证失败");
            }

            string errorMessage;
            var isSuccess = Main.Instance.UserApi.ChangePassword(userName, password, out errorMessage);

            return new
            {
                IsSuccess = isSuccess,
                ErrorMessage = errorMessage
            };
        }

        public static object Edit(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var userInfo = request.UserInfo;
            if (userInfo == null)
            {
                throw new Exception("用户认证失败");
            }

            if (request.GetPostString("avatarUrl") != null)
            {
                userInfo.AvatarUrl = request.GetPostString("avatarUrl");
            }
            if (request.GetPostString("displayName") != null)
            {
                userInfo.DisplayName = request.GetPostString("displayName");
            }
            if (request.GetPostString("gender") != null)
            {
                userInfo.Gender = request.GetPostString("gender");
            }
            if (request.GetPostString("birthday") != null)
            {
                userInfo.Birthday = request.GetPostString("birthday");
            }
            if (request.GetPostString("signature") != null)
            {
                userInfo.Signature = request.GetPostString("signature");
            }
            if (request.GetPostString("organization") != null)
            {
                userInfo.Organization = request.GetPostString("organization");
            }
            if (request.GetPostString("department") != null)
            {
                userInfo.Department = request.GetPostString("department");
            }
            if (request.GetPostString("position") != null)
            {
                userInfo.Position = request.GetPostString("position");
            }
            if (request.GetPostString("education") != null)
            {
                userInfo.Education = request.GetPostString("education");
            }
            if (request.GetPostString("graduation") != null)
            {
                userInfo.Graduation = request.GetPostString("graduation");
            }
            if (request.GetPostString("address") != null)
            {
                userInfo.Address = request.GetPostString("address");
            }
            if (request.GetPostString("interests") != null)
            {
                userInfo.Interests = request.GetPostString("interests");
            }
            if (request.GetPostString("mobile") != null)
            {
                var mobile = request.GetPostString("mobile");
                if (mobile != userInfo.Mobile)
                {
                    var exists = Main.Instance.UserApi.IsMobileExists(mobile);
                    if (!exists)
                    {
                        userInfo.Mobile = mobile;
                        Main.Instance.UserApi.AddLog(userInfo.UserName, "修改手机", string.Empty);
                    }
                    else
                    {
                        throw new Exception("此手机号码已注册，请更换手机号码");
                    }
                }
            }
            if (request.GetPostString("email") != null)
            {
                var email = request.GetPostString("email");
                if (email != userInfo.Email)
                {
                    var exists = Main.Instance.UserApi.IsEmailExists(email);
                    if (!exists)
                    {
                        userInfo.Email = email;
                        Main.Instance.UserApi.AddLog(userInfo.UserName, "修改邮箱", string.Empty);
                    }
                    else
                    {
                        throw new Exception("此邮箱已注册，请更换邮箱");
                    }
                }
            }

            Main.Instance.UserApi.Update(userInfo);
            return userInfo;
        }

        public static object GetLogs(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var action = request.GetPostString("action");
            var totalNum = request.GetPostInt("totalNum", 10);
            var list = Main.Instance.UserApi.GetLogs(request.UserName, totalNum, action);

            return list;
        }

        public static object IsMobileExists(IRequest request)
        {
            var mobile = request.GetPostString("mobile");
            return new
            {
                Exists = Main.Instance.UserApi.IsMobileExists(mobile)
            };
        }

        public static object IsPasswordCorrect(IRequest request)
        {
            var password = request.GetPostString("password");
            string errorMessage;
            var isCorrect = Main.Instance.UserApi.IsPasswordCorrect(password, out errorMessage);
            return new
            {
                IsCorrect = isCorrect,
                ErrorMessage = errorMessage
            };
        }

        public static object IsCodeCorrect(IRequest request)
        {
            var mobile = request.GetPostString("mobile");
            var code = request.GetPostString("code");

            var dbCode = CacheUtils.Get<string>(GetSendSmsCacheKey(mobile));

            var isCorrect = code == dbCode;
            var token = string.Empty;
            if (isCorrect)
            {
                var userInfo = Main.Instance.UserApi.GetUserInfoByMobile(mobile);
                if (userInfo != null)
                {
                    token = request.GetUserTokenByUserName(userInfo.UserName);
                }
            }

            return new
            {
                IsCorrect = isCorrect,
                Token = token
            };
        }

        public static object SendSms(IRequest request)
        {
            var account = request.GetPostString("account");
            var mobile = Main.Instance.UserApi.GetMobileByAccount(account);

            var isSuccess = false;
            var errorMessage = string.Empty;
            var configInfo = Utils.GetConfigInfo();

            if (string.IsNullOrEmpty(mobile) || !Utils.IsMobile(mobile))
            {
                errorMessage = "账号对应的用户未设置手机号码";
            }
            else
            {
                var code = Utils.GetRandomInt(1111, 9999);
                CacheUtils.Remove(GetSendSmsCacheKey(mobile));
                CacheUtils.Insert(GetSendSmsCacheKey(mobile), code.ToString());
                var smsPlugin = Main.Instance.PluginApi.GetPlugin<SmsPlugin>(SmsPlugin.PluginId);
                if (smsPlugin != null && smsPlugin.IsReady)
                {
                    isSuccess = smsPlugin.SendCode(mobile, code, configInfo.UserFindPasswordSmsTplId, out errorMessage);
                }
            }

            return new
            {
                IsSuccess = isSuccess,
                Mobile = mobile,
                ErrorMessage = errorMessage
            };
        }

        public static object SendSmsOrRegister(IRequest request)
        {
            var mobile = request.GetPostString("mobile");
            var password = request.GetPostString("password");
            var userName = request.GetPostString("userName");
            var email = request.GetPostString("email");

            var isSms = false;
            var isRegister = false;
            var errorMessage = string.Empty;
            var configInfo = Utils.GetConfigInfo();


            if (configInfo.IsVerifyUserBySms)
            {
                var smsPlugin = Main.Instance.PluginApi.GetPlugin<SmsPlugin>(SmsPlugin.PluginId);
                if (smsPlugin != null && smsPlugin.IsReady)
                {
                    var code = Utils.GetRandomInt(1111, 9999);
                    CacheUtils.Remove(GetSendSmsCacheKey(mobile));
                    CacheUtils.Insert(GetSendSmsCacheKey(mobile), code.ToString());

                    isSms = smsPlugin.SendCode(mobile, code, configInfo.UserRegistrationSmsTplId, out errorMessage);
                }
            }

            if (!isSms)
            {
                var userInfo = Main.Instance.UserApi.NewInstance();
                userInfo.Email = email;
                userInfo.Mobile = mobile;
                userInfo.UserName = userName;
                isRegister = Main.Instance.UserApi.Insert(userInfo, password, out errorMessage);
            }

            return new
            {
                Email = email,
                Mobile = mobile,
                UserName = userName,
                IsSms = isSms,
                IsRegister = isRegister,
                ErrorMessage = errorMessage
            };
        }

        public static object RegisterWithCode(IRequest request)
        {
            var mobile = request.GetPostString("mobile");
            var password = request.GetPostString("password");
            var code = request.GetPostString("code");

            var dbCode = CacheUtils.Get<string>(GetSendSmsCacheKey(mobile));

            var isRegister = false;
            string errorMessage;

            if (code != dbCode)
            {
                errorMessage = "短信验证码不正确";
            }
            else
            {
                var userInfo = Main.Instance.UserApi.NewInstance();
                userInfo.UserName = mobile;
                userInfo.Mobile = mobile;
                isRegister = Main.Instance.UserApi.Insert(userInfo, password, out errorMessage);
            }

            return new
            {
                IsRegister = isRegister,
                ErrorMessage = errorMessage
            };
        }

        public static object CreateContent(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = request.GetPostInt("siteId");
            var channelId = request.GetPostInt("channelId");

            var groupInfo = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ?? Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());
            var adminName = groupInfo.WritingAdmin;

            var contentInfo = Main.Instance.ContentApi.NewInstance();

            var bodyStream = new StreamReader(request.HttpRequest.InputStream);
            bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
            var raw = bodyStream.ReadToEnd();
            var postData = !string.IsNullOrEmpty(raw) ? JObject.Parse(raw) : new JObject();
            var form = new NameValueCollection();
            foreach (var item in postData)
            {
                form[item.Key] = item.Value.ToString();
            }

            contentInfo.Load(form);

            contentInfo.IsChecked = false;
            contentInfo.SiteId = siteId;
            contentInfo.ChannelId = channelId;
            contentInfo.AddUserName = adminName;
            contentInfo.WritingUserName = request.UserName;
            contentInfo.LastEditUserName = adminName;
            contentInfo.AddDate = DateTime.Now;
            contentInfo.LastEditDate = DateTime.Now;

            var contentId = Main.Instance.ContentApi.Insert(siteId, channelId, contentInfo);

            Main.Instance.UserApi.AddLog(request.UserName, "新增稿件", contentInfo.Title);

            if (groupInfo.Id > 0)
            {
                groupInfo.LastWritingSiteId = siteId;
                groupInfo.LastWritingChannelId = channelId;
                GroupDao.Update(groupInfo);
            }

            return new
            {
                Id = contentId
            };
        }

        public static object DeleteContent(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = request.GetPostInt("siteId");
            var channelId = request.GetPostInt("channelId");
            var id = request.GetPostInt("id");

            var title = Main.Instance.ContentApi.GetContentValue(siteId, channelId, id, nameof(IContentInfo.Title));

            Main.Instance.ContentApi.Delete(siteId, channelId, id);

            Main.Instance.UserApi.AddLog(request.UserName, "删除稿件", title);

            return new { };
        }

        public static object EditContent(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = request.GetPostInt("siteId");
            var channelId = request.GetPostInt("channelId");
            var id = request.GetPostInt("id");

            var groupInfo = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ?? Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());
            var adminName = groupInfo.WritingAdmin;

            var contentInfo = Main.Instance.ContentApi.GetContentInfo(siteId, channelId, id);

            //var formContentInfo = request.GetPostObject<IContentInfo>(string.Empty);
            //contentInfo.Load();

            var bodyStream = new StreamReader(request.HttpRequest.InputStream);
            bodyStream.BaseStream.Seek(0, SeekOrigin.Begin);
            var raw = bodyStream.ReadToEnd();
            var postData = !string.IsNullOrEmpty(raw) ? JObject.Parse(raw) : new JObject();
            var form = new NameValueCollection();
            foreach (var item in postData)
            {
                form[item.Key] = item.Value.ToString();
            }

            contentInfo.Load(form);

            contentInfo.LastEditUserName = adminName;
            contentInfo.LastEditDate = DateTime.Now;
            contentInfo.IsChecked = false;

            Main.Instance.ContentApi.Update(siteId, channelId, contentInfo);

            Main.Instance.UserApi.AddLog(request.UserName, "编辑稿件", contentInfo.Title);

            if (groupInfo.Id > 0)
            {
                groupInfo.LastWritingSiteId = siteId;
                groupInfo.LastWritingChannelId = channelId;
                GroupDao.Update(groupInfo);
            }

            return new { };
        }

        public static object GetContent(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = request.GetPostInt("siteId");
            var channelId = request.GetPostInt("channelId");
            var id = request.GetPostInt("id");

            var contentInfo = Main.Instance.ContentApi.GetContentInfo(siteId, channelId, id);

            if (contentInfo != null && contentInfo.WritingUserName == request.UserName)
            {
                return new
                {
                    Content = Utils.ToDict(contentInfo)
                };
            }

            return null;
        }

        public static object GetContents(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            try
            {
                var siteId = request.GetPostInt("siteId");
                var channelId = request.GetPostInt("channelId");

                var searchType = Utils.FilterSqlAndXss(request.GetPostString("searchType"));
                var keyword = Utils.FilterSqlAndXss(request.GetPostString("keyword"));
                var dateFrom = Utils.FilterSqlAndXss(request.GetPostString("dateFrom"));
                var dateTo = Utils.FilterSqlAndXss(request.GetPostString("dateTo"));
                var page = request.GetPostInt("page");

                const int limit = 30;
                var offset = (page - 1) * limit;

                var groupInfo = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ?? Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());
                var adminName = groupInfo.WritingAdmin;

                var nodeIdList = new List<int> { channelId };

                var writingChannelIdList = Main.Instance.ChannelApi.GetChannelIdList(siteId, adminName);
                foreach (var writingChannelId in writingChannelIdList)
                {
                    var writingChannelInfo = Main.Instance.ChannelApi.GetChannelInfo(siteId, writingChannelId);
                    if (Utils.In(writingChannelInfo.ParentsPath, channelId.ToString()))
                    {
                        nodeIdList.Add(writingChannelInfo.Id);
                    }
                }

                var whereString = new StringBuilder($"WHERE WritingUserName = '{request.UserName}' ");

                whereString.Append(nodeIdList.Count == 1
                    ? $"AND SiteId = {siteId} AND ChannelId = {nodeIdList[0]} "
                    : $"AND SiteId = {siteId} AND ChannelId IN ({string.Join(",", nodeIdList)})");

                var dateString = string.Empty;
                if (!string.IsNullOrEmpty(dateFrom))
                {
                    dateString = $" AND AddDate >= '{dateFrom}' ";
                }
                if (!string.IsNullOrEmpty(dateTo))
                {
                    dateString += $" AND AddDate <= '{Convert.ToDateTime(dateTo).AddDays(1)}' ";
                }

                whereString.Append(string.IsNullOrEmpty(keyword)
                    ? dateString
                    : $"AND ([{searchType}] LIKE '%{keyword}%') {dateString} ");

                var orderString = "ORDER BY IsTop DESC, AddDate DESC, Id DESC";

                var contentInfoList = Main.Instance.ContentApi.GetContentInfoList(siteId, channelId,
                    whereString.ToString(), orderString, limit, offset);

                var totalCount = Main.Instance.ContentApi.GetCount(siteId, channelId,
                    whereString.ToString());
                var totalPage = totalCount == 0 ? 0 : Convert.ToInt32(totalCount / limit);

                return new
                {
                    Results = contentInfoList,
                    TotalPage = totalPage
                };
            }
            catch { }

            return new
            {
                Results = new List<IContentInfo>(),
                TotalPage = 1
            };
        }

        public static object GetChannels(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var nodes = new List<object>();

            try
            {
                var siteId = request.GetPostInt("siteId");

                var groupInfo = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ?? Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());
                var adminName = groupInfo.WritingAdmin;

                var nodeIdList = Main.Instance.ChannelApi.GetChannelIdList(siteId, adminName);

                foreach (var nodeId in nodeIdList)
                {
                    var channelInfo = Main.Instance.ChannelApi.GetChannelInfo(siteId, nodeId);
                    nodes.Add(new
                    {
                        channelInfo.Id,
                        channelInfo.ChannelName
                    });
                }
            }
            catch { }

            return nodes;
        }

        public static object GetSites(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var groupInfo = GroupDao.GetGroupInfo(GroupUserDao.GetGroupId(request.UserName)) ?? Utils.GetDefaultGroupInfo(Utils.GetConfigInfo());
            var adminName = groupInfo.WritingAdmin;

            return Main.Instance.SiteApi.GetSiteInfoList(adminName);
        }

        public static object GetTableColumns(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var siteId = request.GetPostInt("siteId");
            var channelId = request.GetPostInt("channelId");

            return Main.Instance.ContentApi.GetTableColumns(siteId, channelId);
        }

        public static object UploadAvatarResize(IRequest request)
        {
            if (!request.IsUserLoggin)
            {
                throw new Exception("用户认证失败");
            }

            var size = Convert.ToInt32(request.GetPostString("size"));
            var x = Convert.ToInt32(request.GetPostString("x"));
            var y = Convert.ToInt32(request.GetPostString("y"));
            var relatedUrl = request.GetPostString("relatedUrl");

            var filePath = Main.Instance.PluginApi.GetPluginPath(relatedUrl);

            var originalImage = Image.FromFile(filePath);

            var bmpOut = new Bitmap(size, size, PixelFormat.Format24bppRgb);
            var g = Graphics.FromImage(bmpOut);
            g.DrawImage(originalImage, new Rectangle(0, 0, size, size), new Rectangle(x, y, size, size), GraphicsUnit.Pixel);
            g.Dispose();

            if (size > 150)
            {
                bmpOut = new Bitmap(bmpOut, 150, 150);
            }

            var dt = DateTime.Now;
            relatedUrl =
                $"upload/{dt.Year}-{dt.Month}-{dt.Day}/{dt.Hour}{dt.Minute}{dt.Second}{dt.Millisecond}{Path.GetExtension(filePath)}";
            var localFilePath = Main.Instance.PluginApi.GetPluginPath(relatedUrl);
            bmpOut.Save(localFilePath, ImageFormat.Jpeg);

            var avatarUrl = Main.Instance.PluginApi.GetPluginUrl(relatedUrl);

            return new
            {
                AvatarUrl = avatarUrl
            };
        }
    }
}
