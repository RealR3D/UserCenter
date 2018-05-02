<%@ Page Language="C#" Inherits="SS.Home.Pages.PageMenuSettings" %>
  <!DOCTYPE html>
  <html>

  <head>
    <meta charset="utf-8">
    <link href="assets/plugin-utils/css/bootstrap.min.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugin-utils/css/plugin-utils.css" rel="stylesheet" type="text/css" />
    <link href="assets/plugin-utils/css/font-awesome.min.css" rel="stylesheet" type="text/css" />
    <script src="assets/js/jquery.min.js"></script>
    <script src="assets/js/sweetalert.min.js"></script>
  </head>

  <body>
    <form runat="server" class="container">

      <div class="row">
        <div class="card-box">
          <div class="row">
            <div class="col-lg-10">
              <h4 class="m-t-0 header-title"><b>扩展菜单设置</b></h4>
              <p class="text-muted font-13 m-b-30">
                在此设置扩展菜单设置选项
              </p>
              <asp:Literal id="LtlMessage" runat="server" />
            </div>
          </div>

          <div class="form-horizontal">

            <div class="form-group">
              <label class="col-sm-3 control-label">菜单名称</label>
              <div class="col-sm-3">
                <asp:TextBox id="TbTitle" CssClass="form-control" runat="server"></asp:TextBox>
              </div>
              <div class="col-sm-5">
                <span class="help-block"></span>
              </div>
              <div class="col-sm-1">
                <asp:RequiredFieldValidator ControlToValidate="TbTitle" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                />
                <asp:RegularExpressionValidator runat="server" ControlToValidate="TbTitle" ValidationExpression="[^']+" ErrorMessage=" *"
                  ForeColor="red" Display="Dynamic" />
              </div>
            </div>
            <asp:PlaceHolder id="PhSettings" runat="server">
              <div class="form-group">
                <label class="col-sm-3 control-label">链接地址</label>
                <div class="col-sm-3">
                  <asp:TextBox id="TbUrl" CssClass="form-control" runat="server"></asp:TextBox>
                </div>
                <div class="col-sm-5">
                  <span class="help-block"></span>
                </div>
                <div class="col-sm-1">
                  <asp:RequiredFieldValidator ControlToValidate="TbUrl" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                  />
                  <asp:RegularExpressionValidator runat="server" ControlToValidate="TbUrl" ValidationExpression="[^']+" ErrorMessage=" *" ForeColor="red"
                    Display="Dynamic" />
                </div>
              </div>
              <div class="form-group">
                <label class="col-sm-3 control-label">是否新窗口打开</label>
                <div class="col-sm-3">
                  <asp:DropDownList id="DdlIsOpenWindow" class="form-control" runat="server">
                    <asp:ListItem Text="新窗口打开" Value="True"  />
                    <asp:ListItem Text="本窗口打开" Value="False" Selected="True" />
                  </asp:DropDownList>
                </div>
                <div class="col-sm-6">
                  <span class="help-block"></span>
                </div>
              </div>
            </asp:PlaceHolder>

            <div class="form-group m-b-0">
              <div class="col-sm-offset-3 col-sm-9">
                <asp:Button class="btn btn-primary" Text="确 定" OnClick="Submit_OnClick" runat="server" />
                <asp:Button class="btn m-l-10" ID="BtnReturn" Text="返 回" runat="server" />
              </div>
            </div>

          </div>
        </div>
      </div>

    </form>
  </body>

  </html>