using System;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using SS.Home.Core;
using SS.Home.Model;
using SS.Home.Provider;

namespace SS.Home.Pages
{
    public class PageMenuSettings : Page
    {
        public Literal LtlMessage;
        public TextBox TbTitle;
        public PlaceHolder PhSettings;
        public TextBox TbUrl;
        public DropDownList DdlIsOpenWindow;
        public Button BtnAdd;
        public Button BtnReturn;

        private int _parentId;
        private int _menuId;
        private MenuInfo _menuInfo;

        public static string GetRedirectUrl(int parentId, int menuId)
        {
            return $"{nameof(PageMenuSettings)}.aspx?parentId={parentId}&menuId={menuId}";
        }

        public void Page_Load(object sender, EventArgs e)
        {
            if (!Main.Instance.AdminApi.IsPluginAuthorized)
            {
                HttpContext.Current.Response.Write("<h1>未授权访问</h1>");
                HttpContext.Current.Response.End();
                return;
            }

            int.TryParse(Request.QueryString["parentId"], out _parentId);
            int.TryParse(Request.QueryString["menuId"], out _menuId);
            _menuInfo = _menuId > 0 ? MenuDao.GetMenuInfo(_menuId) : new MenuInfo();

            if (IsPostBack) return;

            TbTitle.Text = _menuInfo.Title;
            if (_parentId > 0)
            {
                PhSettings.Visible = true;
                TbUrl.Text = _menuInfo.Url;
                Utils.SelectListItems(DdlIsOpenWindow, _menuInfo.IsOpenWindow.ToString());
            }
            else
            {
                PhSettings.Visible = false;
            }

            BtnReturn.Attributes.Add("onclick", $"location.href='{PageMenu.GetRedirectUrl()}';return false");
        }

        public void Submit_OnClick(object sender, EventArgs e)
        {
            _menuInfo.ParentId = _parentId;
            _menuInfo.Title = TbTitle.Text;
            _menuInfo.Url = TbUrl.Text;
            _menuInfo.IsOpenWindow = Convert.ToBoolean(DdlIsOpenWindow.SelectedValue);
            if (_menuId == 0)
            {
                _menuInfo.Id = MenuDao.Insert(_menuInfo);
            }
            else
            {
                MenuDao.Update(_menuInfo);
            }

            Response.Redirect(PageMenu.GetRedirectUrl());
        }
    }
}