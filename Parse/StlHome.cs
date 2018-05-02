using System.Web.UI.HtmlControls;
using SiteServer.Plugin;
using SS.Home.Core;

namespace SS.Home.Parse
{
    public class StlHome
    {
        private StlHome() { }
        public const string ElementName = "stl:home";

        public const string AttributeType = "type";
        public const string AttributeRedirectUrl = "redirectUrl";

        public const string TypeLogin = "login";
        public const string TypeRegister = "register";
        public const string TypeLogout = "logout";
        public const string TypeHome = "home";

        public static string Parse(IParseContext context)
        {
            var type = string.Empty;
            var redirectUrl = string.Empty;

            var configInfo = Utils.GetConfigInfo();

            var stlAnchor = new HtmlAnchor();

            foreach (var name in context.StlAttributes.Keys)
            {
                var value = context.StlAttributes[name];
                if (Utils.EqualsIgnoreCase(name, AttributeType))
                {
                    type = Main.Instance.ParseApi.ParseAttributeValue(value, context);
                }
                else if (Utils.EqualsIgnoreCase(name, AttributeRedirectUrl))
                {
                    redirectUrl = Main.Instance.ParseApi.ParseAttributeValue(value, context);
                }
                else
                {
                    stlAnchor.Attributes.Add(name, value);
                }
            }

            if (string.IsNullOrEmpty(redirectUrl))
            {
                redirectUrl = Main.Instance.ParseApi.GetCurrentUrl(context);
            }

            var url = "javascript:;";
            if (Utils.EqualsIgnoreCase(type, TypeLogin))
            {
                url = Utils.GetLoginUrl(configInfo.HomeUrl, redirectUrl);


                //if (Utils.EqualsIgnoreCase(loginType, LoginTypeWeibo))
                //{
                //    var callbackUrl = GetApiWeiboUrl(redirectUrl);
                //    var openAuth = new WeiboClient(configInfo.WeiboAppKey, configInfo.WeiboAppSecret, callbackUrl);
                //    url = openAuth.GetAuthorizationUrl();
                //}
                //else if (Utils.EqualsIgnoreCase(loginType, LoginTypeWeixin))
                //{
                //    var callbackUrl = GetApiWeixinUrl(redirectUrl);
                //    var openAuth = new WeixinClient(configInfo.WeixinAppId, configInfo.WeixinAppSecret, callbackUrl);
                //    url = openAuth.GetAuthorizationUrl();
                //}
                //else if (Utils.EqualsIgnoreCase(loginType, LoginTypeQq))
                //{
                //    var callbackUrl = GetApiQqUrl(redirectUrl);
                //    var openAuth = new QqClient(configInfo.QqAppId, configInfo.QqAppKey, callbackUrl);
                //    url = openAuth.GetAuthorizationUrl();
                //}
                //else
                //{
                //    url = Utils.GetLoginUrl(configInfo.HomeUrl, redirectUrl);
                //}
            }
            else if (Utils.EqualsIgnoreCase(type, TypeRegister))
            {
                url = Utils.GetRegisterUrl(configInfo.HomeUrl, redirectUrl);
            }
            else if (Utils.EqualsIgnoreCase(type, TypeLogout))
            {
                url = Utils.GetLogoutUrl(configInfo.HomeUrl, redirectUrl);
            }
            else if (Utils.EqualsIgnoreCase(type, TypeHome))
            {
                url = configInfo.HomeUrl;
            }

            stlAnchor.InnerHtml = Main.Instance.ParseApi.ParseInnerXml(context.StlInnerXml, context);
            stlAnchor.HRef = url;
            return Utils.GetControlRenderHtml(stlAnchor);
        }
    }
}
