var key = '',
    host = '',
    expire = 0,
    accessid = '',
    filename = '',
    accesskey = '',
    signature = '',
    policyBase64 = '',
    callbackbody = '',
    g_object_name = '',
    g_object_name_type = 'local_name',
    now = timestamp = Date.parse(new Date()) / 1000; 

function send_request(ID, name, userName)
{
    var xmlhttp = null;
    if (window.XMLHttpRequest)
    {
        xmlhttp = new XMLHttpRequest();
    }
    else if (window.ActiveXObject)
    {
        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
  
    if (xmlhttp !== null)
    {
        var data = "UserName=" + userName + "&ProId=" + ID + "&ProName=" + name;
        xmlhttp.open("POST",
            //"http://192.168.1.148:66/ajax/FileConsole.ashx?cmd=upload"
            '../../ajax/FileConsole.ashx?cmd=upload'
            , false );
        xmlhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xmlhttp.send( data );
        return xmlhttp.responseText
    } else
    {
        alert("Your browser does not support XMLHTTP.");
    }
};

function get_signature(ID, name, userName)
{
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000; 
    if (expire < now + 3)
    {
        body = send_request(ID, name, userName);
        var obj = JSON.parse(body);
        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        key = obj['dir'];
        return true;
    }
    return false;
};

function random_string(len) {
　　len = len || 32;
　　var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　var maxPos = chars.length;
　　var pwd = '';
　　for (i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}

function get_suffix(filename) {
    pos = filename.lastIndexOf('.')
    suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
}

function calculate_object_name(filename)
{
    g_object_name += "${filename}";
    return '';
}

function get_uploaded_object_name(filename)
{
    if (g_object_name_type == 'local_name')
    {
        tmp_name = g_object_name
        tmp_name = tmp_name.replace("${filename}", filename);
        return tmp_name
    }
    else if(g_object_name_type == 'random_name')
    {
        return g_object_name
    }
}

function set_upload_param(up, filename, ret, ID, name, userName)
{
    if (ret === false)
    {
        ret = get_signature(ID, name, userName);
    };
    g_object_name = key;
    if (filename !== '') {
        suffix = get_suffix(filename);
        calculate_object_name(filename);
    };
    new_multipart_params = {
        'key': g_object_name,
        'policy': policyBase64,
        'signature': signature,
        'callback': callbackbody,
        'OSSAccessKeyId': accessid, 
        'success_action_status' : '200', //让服务端返回200,不然，默认会返回204
    };

    up.setOption({
        'url': host,
        'multipart_params': new_multipart_params
    });

    up.start();
};