// 获取城市
var provinces = []
var cities = []
var getCity = function getCity(resolve) {
    $.ajax({
        url: baseUrl,
        type: "POST",
        contentType: "application/json; charset=utf-8",
        dataType: 'json',
        // jsonp: "callback",
        // async: false,
        data: `{"serviceId":"eu_2013V01cityApi","params": ""}`,
        success: function(data) {

            provinces = data.returnParams.cityList
            cities = data.returnParams.countryList
            resolve()
        }
    })
}

function initProvinces() {
    var pvs = '<option>省份</option>'
    for (var i = 0; i < provinces.length; i++) {
        pvs += (`<option value="${provinces[i].id}">${provinces[i].city}</option>`)
    }
    $('#province').html(pvs)
}

function getLv2(event) {
    console.log($("#province").val())
    let lv2 = []
    cities.forEach(val => {
        // console.log(val)
        if (val.parentid == $("#province").val()) {
            lv2.push(val)
        }
    })
    if (lv2.length == 0) {
        $('#city').hide()
    } else {
        var cts = '<option>城市</option>'
        for (var i = 0; i < lv2.length; i++) {
            cts += (`<option chName="${lv2[i].city}" value="${lv2[i].id}">${lv2[i].city}</option>`)
        }
        $('#city').html(cts)
        $('#city').show()
    }

}


function getFormData(el) {
    var data = {};
    var t = $(el).serializeArray();
    $.each(t, function() {
        data[this.name] = this.value;
    });
    console.log(JSON.stringify(data))
    return JSON.stringify(data)
}

//ajax文件上传

var fontFileId = ''
var backFileId = ''

function doUpload(fileObj, backId, showImg) {
    var fileObj = document.getElementById(fileObj).files[0];
    // FormData 对象
    var formData = new FormData();
    formData.append("savePath", "insurance"); // 可以增加表单数据
    formData.append("file", fileObj); // 文件对象
    formData.append("fileType", "bmp,jpeg,jpg,gif"); // 上传文件的格式限制
    $('.preloader').delay(200).fadeIn(500);
    $.ajax({
        url: 'http://www.rrsbt.com/ajaxUploadApiFile.do',
        type: 'POST',
        dataType: 'json',
        data: formData,
        cache: false,
        contentType: false, // 告诉jQuery不要去设置Content-Type请求头
        processData: false, // 告诉jQuery不要去处理发送的数据
        success: function(returndata) {
            console.log(returndata.fileId)
            if (!returndata.fileId) {
                diyAlert('上传失败,请重试', 'warning', 1)
            } else {
                console.log(backId, returndata)
                if (backId == 'frontcard_file') {
                    fontFileId = returndata.fileId
                } else {
                    backFileId = returndata.fileId
                }
                diyAlert('上传成功', 'success', 1)
                    // $("#" + showImg).attr("src", returndata.path);
            }
            $('.preloader').delay(200).fadeOut(500);

        },
        error: function(returndata) {
            $('.preloader').delay(200).fadeOut(500);
            diyAlert('网络错误', 'warning', 1)
        }
    });
}

function diyAlert(msg, type, isIframe = 0) {
    if (isIframe == 0) {
        $('.alert').attr('class', `alert alert-${type} row`)
        $('.alert').animate({ top: "15px" })
        $('.alertMsg').text(msg)
        setTimeout(() => {
            $('.alert').animate({ top: "-55px" })
        }, 2000)
    } else {
        $('.alert', parent.document).attr('class', `alert alert-${type} row`)
        $('.alert', parent.document).animate({ top: "15px" })
        $('.alertMsg', parent.document).text(msg)
        setTimeout(() => {
            $('.alert', parent.document).animate({ top: "-55px" })
        }, 2000)
    }
}

function getQueryVariable(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i = 0; i < vars.length; i++) {
        var pair = vars[i].split("=");
        if (pair[0] == variable) {
            return pair[1];
        }
    }
    return (false);
}

function btnDisabled(element, text, state) {
    var btn = $(element);
    console.log(btn)
    btn.text(text)
    if (state == 'off') {
        btn.removeAttr("disabled")
    } else {
        btn.attr("disabled", "disabled")
    }

}