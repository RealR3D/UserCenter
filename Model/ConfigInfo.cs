using System;
using Newtonsoft.Json;

namespace SS.Home.Model
{
    [JsonObject(MemberSerialization.OptOut)]
    public class ConfigInfo
    {
        public string HomeUrl { get; set; } = "/home";

        public string Title { get; set; } = "用户中心";

        public string Copyright { get; set; } = "Copyright©" + DateTime.Now.Year + " All Rights Reserved";

        public string BeianNo { get; set; }

        public string LogoUrl { get; set; } = Main.Instance.PluginApi.GetPluginUrl("home_logo.png");

        public string DefaultAvatarUrl { get; set; } = Main.Instance.PluginApi.GetPluginUrl("default_avatar.png");

        public bool IsVerifyUserBySms { get; set; }
        public string UserRegistrationSmsTplId { get; set; }
        public string UserFindPasswordSmsTplId { get; set; }

        public bool IsWriting { get; set; } = false;

        public string WritingAdmin { get; set; } = "";
    }
}