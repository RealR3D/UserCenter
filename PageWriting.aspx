<%@ Page Language="C#" Inherits="SS.Home.Pages.PageWriting" %>

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
    <form runat="server">
      <div class="container" runat="server">
        <div class="m-b-25"></div>

        <div class="raw">
          <div class="card-box">
            <h4 class="m-t-0 header-title"><b>用户投稿设置</b></h4>
            <p class="text-muted font-13 m-b-25">
              用户的投稿范围为关联管理员所属角色下有权限的站点及栏目
            </p>

            <asp:Literal id="LtlMessage" runat="server" />

            <table class="table table-hover m-0">
              <thead>
                <tr>
                  <th>用户组</th>
                  <th>状态</th>
                  <th>关联管理员</th>
                  <th>关联用户</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <asp:Repeater ID="RptContents" runat="server">
                  <itemtemplate>
                    <tr id="trItem" runat="server" style="cursor: pointer">
                      <td>
                        <div class="m-t-10 m-b-10">
                          <asp:Literal id="ltlGroupName" runat="server" />
                        </div>
                      </td>
                      <td>
                        <div class="m-t-10 m-b-10">
                          <asp:Literal id="ltlStatus" runat="server" />
                        </div>
                      </td>
                      <td>
                        <div class="m-t-10 m-b-10">
                          <asp:Literal id="ltlAdmin" runat="server" />
                        </div>
                      </td>
                      <td>
                        <div class="m-t-10 m-b-10">
                          <asp:Literal id="ltlUsers" runat="server" />
                        </div>
                      </td>
                      <td>
                        <div class="m-t-10 m-b-10">
                          <asp:Literal id="ltlDelete" runat="server" />
                        </div>
                      </td>
                    </tr>
                  </itemtemplate>
                </asp:Repeater>
              </tbody>
            </table>

            <div class="m-b-25"></div>

            <asp:Button class="btn btn-success" id="BtnAdd" Text="新增用户组" runat="server" />

          </div>
        </div>

      </div>
    </form>
  </body>

  </html>