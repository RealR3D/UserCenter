<%@ Page Language="C#" Inherits="SS.Home.Pages.PageSettings" %>
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <link href="assets/plugin-utils/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugin-utils/css/plugin-utils.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugin-utils/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugin-utils/css/ionicons.min.css" rel="stylesheet" type="text/css" />
    <script src="assets/js/jquery.min.js" type="text/javascript"></script>
    <script src="assets/js/ajaxUpload.js" type="text/javascript"></script>
  </head>

  <body>
    <div style="padding: 20px 0;">

      <div class="container">
        <form id="form" runat="server" class="form-horizontal">

          <div class="row">
            <div class="card-box">
              <div class="row">
                <div class="col-lg-10">
                  <h4 class="m-t-0 header-title"><b>用户中心设置</b></h4>
                  <p class="text-muted font-13 m-b-30">
                    在此设置用户中心
                  </p>
                </div>
              </div>

              <asp:Literal id="LtlMessage" runat="server" />

              <div class="form-horizontal">

                <div class="form-group">
                  <label class="col-sm-3 control-label">用户中心访问地址</label>
                  <div class="col-sm-3">
                    <asp:TextBox ID="TbHomeUrl" class="form-control" runat="server"></asp:TextBox>
                  </div>
                  <div class="col-sm-6">
                    <asp:RequiredFieldValidator ControlToValidate="TbHomeUrl" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                    />
                  </div>
                </div>

                <div class="form-group">
                    <label class="col-sm-3 control-label">用户中心名称</label>
                    <div class="col-sm-3">
                      <asp:TextBox ID="TbTitle" class="form-control" runat="server"></asp:TextBox>
                    </div>
                    <div class="col-sm-6">
                      <asp:RequiredFieldValidator ControlToValidate="TbTitle" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                      />
                    </div>
                  </div>

                <div class="form-group">
                  <label class="col-sm-3 control-label">版权信息</label>
                  <div class="col-sm-3">
                    <asp:TextBox ID="TbCopyright" class="form-control" runat="server"></asp:TextBox>
                  </div>
                  <div class="col-sm-6">
                    <span class="help-block"></span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-sm-3 control-label">备案号</label>
                  <div class="col-sm-3">
                    <asp:TextBox ID="TbBeianNo" class="form-control" runat="server"></asp:TextBox>
                  </div>
                  <div class="col-sm-6">
                    <span class="help-block"></span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-sm-3 control-label">用户中心LOGO</label>
                  <div class="col-sm-3">
                    <asp:Literal ID="LtlLogoUrl" runat="server"></asp:Literal>
                  </div>
                  <div class="col-sm-6">
                    <span class="help-block">尺寸：168×48</span>
                    <div id="uploadLogo" class="btn btn-success">选 择</div>
                    <span id="upload_logo_txt" style="clear: both; font-size: 12px; color: #FF3737;"></span>
                    <script type="text/javascript" language="javascript">
                      $(document).ready(function () {
                        new AjaxUpload('uploadLogo', {
                          action: "PageSettings.aspx?uploadLogo=true",
                          name: "Filedata",
                          data: {},
                          onSubmit: function (file, ext) {
                            var reg = /^(gif|jpg|jpeg|png)$/i;
                            if (ext && reg.test(ext)) {
                              $('#upload_logo_txt').text('上传中... ');
                            } else {
                              $('#upload_logo_txt').text('系统不允许上传指定的格式');
                              return false;
                            }
                          },
                          onComplete: function (file, response) {
                            console.log(response);
                            if (response) {
                              response = JSON.parse(response)
                              if (response.success === 'true') {
                                $('#upload_logo_txt').text('');
                                $('#logoUrl').attr('src', response.logoUrl + '?v=' + Math.random());
                              } else {
                                $('#upload_logo_txt').text(response.message);
                              }
                            }
                          }
                        });
                      });
                    </script>
                  </div>
                </div>

                <div class="form-group">
                  <label class="col-sm-3 control-label">默认用户头像</label>
                  <div class="col-sm-3">
                    <asp:Literal ID="LtlDefaultAvatarUrl" runat="server"></asp:Literal>
                  </div>
                  <div class="col-sm-6">
                    <span class="help-block">尺寸：160×160</span>
                    <div id="uploadDefaultAvatar" class="btn btn-success">选 择</div>
                    <span id="upload_default_avatar_txt" style="clear: both; font-size: 12px; color: #FF3737;"></span>
                    <script type="text/javascript" language="javascript">
                      $(document).ready(function () {
                        new AjaxUpload('uploadDefaultAvatar', {
                          action: "PageSettings.aspx?uploadDefaultAvatar=true",
                          name: "Filedata",
                          data: {},
                          onSubmit: function (file, ext) {
                            var reg = /^(gif|jpg|jpeg|png)$/i;
                            if (ext && reg.test(ext)) {
                              $('#upload_default_avatar_txt').text('上传中... ');
                            } else {
                              $('#upload_default_avatar_txt').text('系统不允许上传指定的格式');
                              return false;
                            }
                          },
                          onComplete: function (file, response) {
                            console.log(response);
                            if (response) {
                              response = JSON.parse(response)
                              if (response.success === 'true') {
                                $('#upload_default_avatar_txt').text('');
                                $('#defaultAvatarUrl').attr('src', response.defaultAvatarUrl + '?v=' + Math.random());
                              } else {
                                $('#upload_default_avatar_txt').text(response.message);
                              }
                            }
                          }
                        });
                      });
                    </script>
                  </div>
                </div>

                <div class="form-group m-b-0">
                  <div class="col-sm-offset-3 col-sm-9">
                    <asp:Button class="btn btn-primary" id="Submit" text="确 定" onclick="Submit_OnClick" runat="server" />
                  </div>
                </div>

              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  </body>

  </html>