using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SS.Home.Core;
using SS.Home.Model;
using SS.Home.Provider;

namespace SS.Home.Pages
{
    public class PageMenu : Page
    {
        public Literal LtlMessage;
        public Repeater RptContents;
        public Button BtnAdd;

        public static string GetRedirectUrl()
        {
            return nameof(PageMenu) + ".aspx";
        }

        public void Page_Load(object sender, EventArgs e)
        {
            if (!Main.Instance.AdminApi.IsPluginAuthorized)
            {
                HttpContext.Current.Response.Write("<h1>未授权访问</h1>");
                HttpContext.Current.Response.End();
                return;
            }

            if (!string.IsNullOrEmpty(Request.QueryString["delete"]) &&
                !string.IsNullOrEmpty(Request.QueryString["menuId"]))
            {
                MenuDao.Delete(Convert.ToInt32(Request.QueryString["menuId"]));
                LtlMessage.Text = Utils.GetMessageHtml("删除成功！", true);
            }
            else if (!string.IsNullOrEmpty(Request.QueryString["up"]) &&
                !string.IsNullOrEmpty(Request.QueryString["parentId"]) &&
                !string.IsNullOrEmpty(Request.QueryString["menuId"]))
            {
                MenuDao.UpdateTaxisToUp(Convert.ToInt32(Request.QueryString["parentId"]), Convert.ToInt32(Request.QueryString["menuId"]));
                LtlMessage.Text = Utils.GetMessageHtml("排序成功！", true);
            }
            else if (!string.IsNullOrEmpty(Request.QueryString["down"]) &&
                !string.IsNullOrEmpty(Request.QueryString["parentId"]) &&
                !string.IsNullOrEmpty(Request.QueryString["menuId"]))
            {
                MenuDao.UpdateTaxisToDown(Convert.ToInt32(Request.QueryString["parentId"]), Convert.ToInt32(Request.QueryString["menuId"]));
                LtlMessage.Text = Utils.GetMessageHtml("排序成功！", true);
            }

            if (IsPostBack) return;

            var menuInfoList = MenuDao.GetMenuInfoList(0);
            RptContents.DataSource = menuInfoList;
            RptContents.ItemDataBound += RptContents_ItemDataBound;
            RptContents.DataBind();

            BtnAdd.OnClientClick = $"location.href = '{PageMenuSettings.GetRedirectUrl(0, 0)}';return false;";
        }

        private void RptContents_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            if (e.Item.ItemType != ListItemType.Item && e.Item.ItemType != ListItemType.AlternatingItem) return;

            var menuInfo = (MenuInfo) e.Item.DataItem;

            var ltlTitle = (Literal) e.Item.FindControl("ltlTitle");
            var phMenus = (PlaceHolder) e.Item.FindControl("phMenus");
            var rptMenus = (Repeater) e.Item.FindControl("rptMenus");
            var ltlActions = (Literal)e.Item.FindControl("ltlActions");

            ltlTitle.Text = menuInfo.Title;

            var menuInfoList = MenuDao.GetMenuInfoList(menuInfo.Id);
            if (menuInfoList.Count > 0)
            {
                phMenus.Visible = true;
                rptMenus.DataSource = menuInfoList;
                rptMenus.ItemDataBound += RptMenus_ItemDataBound;
                rptMenus.DataBind();
            }

            ltlActions.Text = $@"
<a href=""{PageMenuSettings.GetRedirectUrl(menuInfo.Id, 0)}"" class=""m-r-10"" onclick=""event.stopPropagation();"">新增二级菜单</a>
<a href=""{PageMenuSettings.GetRedirectUrl(menuInfo.ParentId, menuInfo.Id)}"" class=""m-r-10"" onclick=""event.stopPropagation();"">编辑</a>
<a href=""{GetRedirectUrl()}?up={true}&parentId={menuInfo.ParentId}&menuId={menuInfo.Id}"" class=""m-r-10"">上升</a>
<a href=""{GetRedirectUrl()}?down={true}&parentId={menuInfo.ParentId}&menuId={menuInfo.Id}"" class=""m-r-10"">下降</a>
<script>function del() {{{Utils.SwalWarning("删除菜单", $"此操作将删除菜单“{menuInfo.Title}”，确认吗？", "取消", "删除", $"location.href = '{GetRedirectUrl()}?delete={true}&menuId={menuInfo.Id}'")}}}</script>
<a href=""javascript:;"" onclick=""event.stopPropagation();del();"">删除</a>";
        }

        private void RptMenus_ItemDataBound(object sender, RepeaterItemEventArgs e)
        {
            if (e.Item.ItemType != ListItemType.Item && e.Item.ItemType != ListItemType.AlternatingItem) return;

            var menuInfo = (MenuInfo)e.Item.DataItem;

            var ltlTitle = (Literal)e.Item.FindControl("ltlTitle");
            var ltlUrl = (Literal)e.Item.FindControl("ltlUrl");
            var ltlIsOpenWindow = (Literal)e.Item.FindControl("ltlIsOpenWindow");
            var ltlActions = (Literal)e.Item.FindControl("ltlActions");

            ltlTitle.Text = menuInfo.Title;
            if (menuInfo.ParentId > 0)
            {
                ltlUrl.Text = menuInfo.Url;
                ltlIsOpenWindow.Text = menuInfo.IsOpenWindow ? "新窗口" : "当前窗口";
            }

            ltlActions.Text = $@"
<a href=""{PageMenuSettings.GetRedirectUrl(menuInfo.ParentId, menuInfo.Id)}"" class=""m-r-10"" onclick=""event.stopPropagation();"">编辑</a>
<a href=""{GetRedirectUrl()}?up={true}&parentId={menuInfo.ParentId}&menuId={menuInfo.Id}"" class=""m-r-10"">上升</a>
<a href=""{GetRedirectUrl()}?down={true}&parentId={menuInfo.ParentId}&menuId={menuInfo.Id}"" class=""m-r-10"">下降</a>
<script>function del() {{{Utils.SwalWarning("删除菜单", $"此操作将删除菜单“{menuInfo.Title}”，确认吗？", "取消", "删除", $"location.href = '{GetRedirectUrl()}?delete={true}&menuId={menuInfo.Id}'")}}}</script><a href=""javascript:;"" onclick=""event.stopPropagation();del();"">删除</a>";
        }
    }
}