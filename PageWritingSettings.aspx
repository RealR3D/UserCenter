<%@ Page Language="C#" Inherits="SS.Home.Pages.PageWritingSettings" %>
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
              <h4 class="m-t-0 header-title"><b>用户投稿设置</b></h4>
              <p class="text-muted font-13 m-b-30">
                在此设置用户组投稿选项
              </p>
              <asp:Literal id="LtlMessage" runat="server" />
            </div>
          </div>

          <div class="form-horizontal">

            <div class="form-group">
              <label class="col-sm-3 control-label">用户组</label>
              <div class="col-sm-3">
                  <asp:TextBox id="TbGroupName" CssClass="form-control" runat="server"></asp:TextBox>
              </div>
              <div class="col-sm-5">
                  <span class="help-block"></span>
                </div>
                <div class="col-sm-1">
                  <asp:RequiredFieldValidator ControlToValidate="TbGroupName" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                  />
                  <asp:RegularExpressionValidator runat="server" ControlToValidate="TbGroupName" ValidationExpression="[^']+" ErrorMessage=" *"
                    ForeColor="red" Display="Dynamic" />
                </div>
            </div>
            <asp:PlaceHolder id="PhUsers" runat="server">
                <div class="form-group">
                    <label class="col-sm-3 control-label">关联用户</label>
                    <div class="col-sm-3">
                        <asp:TextBox id="TbUsers" CssClass="form-control" runat="server"></asp:TextBox>
                    </div>
                    <div class="col-sm-5">
                        <span class="help-block"></span>
                      </div>
                      <div class="col-sm-1">
                        <asp:RequiredFieldValidator ControlToValidate="TbUsers" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                        />
                        <asp:RegularExpressionValidator runat="server" ControlToValidate="TbUsers" ValidationExpression="[^']+" ErrorMessage=" *"
                          ForeColor="red" Display="Dynamic" />
                      </div>
                  </div>
            </asp:PlaceHolder>

            <div class="form-group">
              <label class="col-sm-3 control-label">是否启用投稿</label>
              <div class="col-sm-3">
                <asp:DropDownList id="DdlIsEnabled" AutoPostBack="true" OnSelectedIndexChanged="DdlIsEnabled_SelectedIndexChanged" class="form-control"
                  runat="server">
                  <asp:ListItem Text="启用" Value="True" Selected="True" />
                  <asp:ListItem Text="不启用" Value="False" />
                </asp:DropDownList>
              </div>
              <div class="col-sm-6">
                <span class="help-block"></span>
              </div>
            </div>

            <asp:PlaceHolder id="PhSettings" runat="server">

              <div class="form-group">
                <label class="col-sm-3 control-label">关联管理员</label>
                <div class="col-sm-3">
                  <asp:TextBox id="TbAdmin" class="form-control" runat="server"></asp:TextBox>
                </div>
                <div class="col-sm-5">
                  <span class="help-block"></span>
                </div>
                <div class="col-sm-1">
                  <asp:RequiredFieldValidator ControlToValidate="TbAdmin" ErrorMessage=" *" ForeColor="red" Display="Dynamic" runat="server"
                  />
                  <asp:RegularExpressionValidator runat="server" ControlToValidate="TbAdmin" ValidationExpression="[^']+" ErrorMessage=" *"
                    ForeColor="red" Display="Dynamic" />
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