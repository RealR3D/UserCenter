<%@ Page Language="C#" Inherits="SS.Home.Pages.PageMenu" %>

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
            <h4 class="m-t-0 header-title"><b>扩展菜单设置</b></h4>
            <p class="text-muted font-13 m-b-25">
              在此设置用户中心扩展菜单
            </p>

            <asp:Literal id="LtlMessage" runat="server" />

            <div class="form-horizontal">

              <asp:Repeater ID="RptContents" runat="server">
                <itemtemplate>
                  <div class="form-group">
                    <label class="col-sm-2 control-label">
                      <asp:Literal id="ltlTitle" runat="server" />
                    </label>
                    <div class="col-sm-10">
                        <asp:Literal id="ltlActions" runat="server" />

                      <asp:PlaceHolder id="phMenus" runat="server" visible="false">

                        <table class="table table-bordered m-t-10">
                          <thead>
                            <tr>
                              <th>二级菜单</th>
                              <th>链接地址</th>
                              <th></th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            <asp:Repeater ID="rptMenus" runat="server">
                              <itemtemplate>
                                <tr>
                                  <td>
                                    <div class="m-t-10 m-b-10">
                                      <asp:Literal id="ltlTitle" runat="server" />
                                    </div>
                                  </td>
                                  <td>
                                    <div class="m-t-10 m-b-10">
                                      <asp:Literal id="ltlUrl" runat="server" />
                                    </div>
                                  </td>
                                  <td>
                                    <div class="m-t-10 m-b-10">
                                      <asp:Literal id="ltlIsOpenWindow" runat="server" />
                                    </div>
                                  </td>
                                  <td>
                                    <div class="m-t-10 m-b-10">
                                      <asp:Literal id="ltlActions" runat="server" />
                                    </div>
                                  </td>
                                </tr>
                              </itemtemplate>
                            </asp:Repeater>
                          </tbody>
                        </table>

                      </asp:PlaceHolder>
                    </div>
                  </div>
                </itemtemplate>
              </asp:Repeater>

            </div>



            <div class="m-b-25"></div>

            <asp:Button class="btn btn-success" id="BtnAdd" Text="新增一级菜单" runat="server" />

          </div>
        </div>

      </div>
    </form>
  </body>

  </html>