using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using SS.Home.Core;
using SS.Home.Model;
using SS.Home.Provider;

namespace SS.Home.Pages
{
    public class PageWriting : Page
    {
        public Literal LtlMessage;
        public Repeater RptContents;
        public Button BtnAdd;

        private ConfigInfo _configInfo;

        public static string GetRedirectUrl()
        {
            return nameof(PageWriting) + ".aspx";
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

            if (!string.IsNullOrEmpty(Request.QueryString["delete"]) &&
                !string.IsNullOrEmpty(Request.QueryString["groupId"]))
            {
                GroupDao.Delete(Convert.ToInt32(Request.QueryString["groupId"]));
                LtlMessage.Text = Utils.GetMessageHtml("删除成功！", true);
            }

            if (IsPostBack) return;

            var groupInfoList = GroupDao.GetGroupInfoList();
            groupInfoList.Insert(0, Utils.GetDefaultGroupInfo(_configInfo));
            RptContents.DataSource = groupInfoList;
            RptContents.ItemDataBound += RptContents_ItemDataBound;
            RptContents.DataBind();

            BtnAdd.OnClientClick = $"location.href = '{PageWritingSettings.GetAddUrl()}';return false;";
        }

        private static void RptContents_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            if (e.Item.ItemType != ListItemType.Item && e.Item.ItemType != ListItemType.AlternatingItem) return;

            var groupInfo = (GroupInfo) e.Item.DataItem;

            var trItem = (HtmlTableRow) e.Item.FindControl("trItem");
            var ltlGroupName = (Literal) e.Item.FindControl("ltlGroupName");
            var ltlStatus = (Literal) e.Item.FindControl("ltlStatus");
            var ltlAdmin = (Literal) e.Item.FindControl("ltlAdmin");
            var ltlUsers = (Literal) e.Item.FindControl("ltlUsers");
            var ltlDelete = (Literal)e.Item.FindControl("ltlDelete");

            trItem.Attributes.Add("onclick", $"location.href = '{PageWritingSettings.GetRedirectUrl(groupInfo.Id)}';return false;");
            ltlGroupName.Text = groupInfo.GroupName;
            ltlStatus.Text = groupInfo.IsWriting ? "启用投稿" : "禁用投稿";
            ltlAdmin.Text = groupInfo.WritingAdmin;
            if (groupInfo.Id == 0) return;

            var userNameList = GroupUserDao.GetUserNameList(groupInfo.Id);
            ltlUsers.Text = string.Join(",", userNameList);

            ltlDelete.Text = $@"<script>function del() {{{Utils.SwalWarning("删除用户组", $"此操作将删除用户组“{groupInfo.GroupName}”，确认吗？", "取消", "删除", $"location.href = '{GetRedirectUrl()}?delete={true}&groupId={groupInfo.Id}'")}}}</script><a href=""javascript:;"" onclick=""event.stopPropagation();del();"">删除</a>";
        }
    }
}