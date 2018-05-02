using System;
using System.Collections;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SS.Home.Core;
using SS.Home.Model;

namespace SS.Home.Pages
{
    public class PageSettings : Page
    {
        public Literal LtlMessage;
        public TextBox TbHomeUrl;
        public TextBox TbTitle;
        public TextBox TbCopyright;
        public TextBox TbBeianNo;
        public Literal LtlLogoUrl;
        public Literal LtlDefaultAvatarUrl;

        private ConfigInfo _configInfo;

        public void Page_Load(object sender, EventArgs e)
        {
            if (!Main.Instance.AdminApi.IsPluginAuthorized)
            {
                HttpContext.Current.Response.Write("<h1>未授权访问</h1>");
                HttpContext.Current.Response.End();
                return;
            }

            _configInfo = Utils.GetConfigInfo();

            if (!string.IsNullOrEmpty(Request.QueryString["uploadLogo"]))
            {
                var attributes = UploadLogo();
                var json = Utils.JsonSerialize(attributes);
                Response.Write(json);
                Response.End();
                return;
            }
            if (!string.IsNullOrEmpty(Request.QueryString["uploadDefaultAvatar"]))
            {
                var attributes = UploadDefaultAvatar();
                var json = Utils.JsonSerialize(attributes);
                Response.Write(json);
                Response.End();
                return;
            }

            LtlLogoUrl.Text = $@"<img id=""logoUrl"" src=""{_configInfo.LogoUrl}"" />";
            LtlDefaultAvatarUrl.Text = $@"<img id=""defaultAvatarUrl"" src=""{_configInfo.DefaultAvatarUrl}"" />";

            if (IsPostBack) return;

            TbHomeUrl.Text = _configInfo.HomeUrl;
            TbTitle.Text = _configInfo.Title;
            TbCopyright.Text = _configInfo.Copyright;
            TbBeianNo.Text = _configInfo.BeianNo;
        }

        public void Submit_OnClick(object sender, EventArgs e)
        {
            if (!Page.IsPostBack || !Page.IsValid) return;

            _configInfo.HomeUrl = TbHomeUrl.Text;
            _configInfo.Title = TbTitle.Text;
            _configInfo.Copyright = TbCopyright.Text;
            _configInfo.BeianNo = TbBeianNo.Text;

            Main.Instance.ConfigApi.SetConfig(0, _configInfo);

            LtlMessage.Text = Utils.GetMessageHtml("用户中心设置修改成功！", true);
        }

        private Hashtable UploadLogo()
        {
            var success = false;
            var message = string.Empty;
            var logoUrl = _configInfo.LogoUrl;

            if (Request.Files["Filedata"] != null)
            {
                var postedFile = Request.Files["Filedata"];
                try
                {
                    if (!string.IsNullOrEmpty(postedFile?.FileName))
                    {
                        var filePath = postedFile.FileName;
                        var fileExtName = filePath.ToLower().Substring(filePath.LastIndexOf(".", StringComparison.Ordinal) + 1);
                        if (fileExtName == "jpg" || fileExtName == "jpeg" || fileExtName == "png" || fileExtName == "gif")
                        {
                            string fileName = $"home_logo.{fileExtName}";
                            var logoPath = Main.Instance.PluginApi.GetPluginPath(fileName);
                            postedFile.SaveAs(logoPath);
                            logoUrl = Main.Instance.PluginApi.GetPluginUrl(fileName);
                            _configInfo.LogoUrl = logoUrl;
                            Main.Instance.ConfigApi.SetConfig(0, _configInfo);

                            success = true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }

            var jsonAttributes = new Hashtable();
            if (success)
            {
                jsonAttributes.Add("success", "true");
                jsonAttributes.Add("logoUrl", logoUrl);
            }
            else
            {
                jsonAttributes.Add("success", "false");
                if (string.IsNullOrEmpty(message))
                {
                    message = "图标上传失败";
                }
                jsonAttributes.Add("message", message);
            }

            return jsonAttributes;
        }

        private Hashtable UploadDefaultAvatar()
        {
            var success = false;
            var message = string.Empty;
            var defaultAvatarUrl = _configInfo.DefaultAvatarUrl;

            if (Request.Files["Filedata"] != null)
            {
                var postedFile = Request.Files["Filedata"];
                try
                {
                    if (!string.IsNullOrEmpty(postedFile?.FileName))
                    {
                        var filePath = postedFile.FileName;
                        var fileExtName = filePath.ToLower().Substring(filePath.LastIndexOf(".", StringComparison.Ordinal) + 1);
                        if (fileExtName == "jpg" || fileExtName == "jpeg" || fileExtName == "png" || fileExtName == "gif")
                        {
                            string fileName = $"default_avatar.{fileExtName}";
                            var logoPath = Main.Instance.PluginApi.GetPluginPath(fileName);
                            postedFile.SaveAs(logoPath);
                            defaultAvatarUrl = Main.Instance.PluginApi.GetPluginUrl(fileName);
                            _configInfo.DefaultAvatarUrl = defaultAvatarUrl;
                            Main.Instance.ConfigApi.SetConfig(0, _configInfo);

                            success = true;
                        }
                    }
                }
                catch (Exception ex)
                {
                    message = ex.Message;
                }
            }

            var jsonAttributes = new Hashtable();
            if (success)
            {
                jsonAttributes.Add("success", "true");
                jsonAttributes.Add("defaultAvatarUrl", defaultAvatarUrl);
            }
            else
            {
                jsonAttributes.Add("success", "false");
                if (string.IsNullOrEmpty(message))
                {
                    message = "图标上传失败";
                }
                jsonAttributes.Add("message", message);
            }

            return jsonAttributes;
        }
    }
}