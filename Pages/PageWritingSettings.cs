using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SS.Home.Core;
using SS.Home.Model;
using SS.Home.Provider;

namespace SS.Home.Pages
{
    public class PageWritingSettings : Page
    {
        public Literal LtlMessage;
        public TextBox TbGroupName;
        public PlaceHolder PhUsers;
        public TextBox TbUsers;
        public DropDownList DdlIsEnabled;
        public PlaceHolder PhSettings;
        public TextBox TbAdmin;
        public Button BtnAdd;
        public Button BtnReturn;

        private ConfigInfo _configInfo;
        private GroupInfo _groupInfo;

        public static string GetRedirectUrl(int groupId)
        {
            return nameof(PageWritingSettings) + ".aspx?groupId=" + groupId;
        }

        public static string GetAddUrl()
        {
            return nameof(PageWritingSettings) + ".aspx?add=" + true;
        }

        public void Page_Load(object sender, EventArgs e)
        {
            if (!Main.Instance.AdminApi.IsPluginAuthorized)
            {
                HttpContext.Current.Response.Write("<h1>未授权访问</h1>");
                HttpContext.Current.Response.End();
                return;
            }

            _configInfo = Utils.GetConfigInfo();

            if (!string.IsNullOrEmpty(Request.QueryString["groupId"]))
            {
                _groupInfo = GroupDao.GetGroupInfo(Convert.ToInt32(Request.QueryString["groupId"])) ??
                             Utils.GetDefaultGroupInfo(_configInfo);
            }
            else
            {
                _groupInfo = new GroupInfo();
            }

            if (IsPostBack) return;

            TbGroupName.Text = _groupInfo.GroupName;
            if (_groupInfo.Id > 0)
            {
                var userNameList = GroupUserDao.GetUserNameList(_groupInfo.Id);
                TbUsers.Text = string.Join(",", userNameList);
            }

            if (string.IsNullOrEmpty(Request.QueryString["add"]) && _groupInfo.Id == 0)
            {
                TbGroupName.Enabled = false;
                PhUsers.Visible = false;
            }

            PhSettings.Visible = _groupInfo.IsWriting;
            Utils.SelectListItems(DdlIsEnabled, _groupInfo.IsWriting.ToString());
            PhSettings.Visible = _groupInfo.IsWriting;
            TbAdmin.Text = _groupInfo.WritingAdmin;

            BtnReturn.Attributes.Add("onclick", $"location.href='{PageWriting.GetRedirectUrl()}';return false");
        }

        public void DdlIsEnabled_SelectedIndexChanged(object sender, EventArgs e)
        {
            PhSettings.Visible = Convert.ToBoolean(DdlIsEnabled.SelectedValue);
        }

        public void Submit_OnClick(object sender, EventArgs e)
        {
            var isWriting = Convert.ToBoolean(DdlIsEnabled.SelectedValue);
            if (isWriting)
            {
                if (!Main.Instance.AdminApi.IsAdminNameExists(TbAdmin.Text))
                {
                    LtlMessage.Text = Utils.GetMessageHtml("关联管理员不存在，请重新填写！", false);
                    return;
                }
            }

            var userNameList = new List<string>();
            foreach (var userNameStr in TbUsers.Text.Trim().Split(','))
            {
                if (string.IsNullOrEmpty(userNameStr)) continue;
                var userName = userNameStr.Trim();
                if (!userNameList.Contains(userName) && Main.Instance.UserApi.IsUserNameExists(userName))
                {
                    userNameList.Add(userName);
                }
            }

            if (!string.IsNullOrEmpty(Request.QueryString["add"]) && _groupInfo.Id == 0)
            {
                _groupInfo.GroupName = TbGroupName.Text;
                _groupInfo.IsWriting = isWriting;
                _groupInfo.WritingAdmin = TbAdmin.Text;
                _groupInfo.Id = GroupDao.Insert(_groupInfo);
            }
            else
            {
                if (_groupInfo.Id == 0)
                {
                    _configInfo.IsWriting = isWriting;
                    _configInfo.WritingAdmin = TbAdmin.Text;
                    Main.Instance.ConfigApi.SetConfig(0, _configInfo);
                }
                else
                {
                    _groupInfo.GroupName = TbGroupName.Text;
                    _groupInfo.IsWriting = isWriting;
                    _groupInfo.WritingAdmin = TbAdmin.Text;
                    GroupDao.Update(_groupInfo);
                }
            }

            if (_groupInfo.Id > 0)
            {
                GroupUserDao.Delete(_groupInfo.Id);
                foreach (var userName in userNameList)
                {
                    GroupUserDao.Insert(_groupInfo.Id, userName);
                }
            }

            Response.Redirect(PageWriting.GetRedirectUrl());
        }
    }
}