var baseUrl = 'http://www.rrsbt.com/clientServices.do?iscrypt=1'
    // var baseUrl = 'http://leideqiang.w3.luyouxia.net/oa/clientServices.do?iscrypt=1'
    // var baseUrl = 'http://leideqiang.w3.luyouxia.net/insurance/clientServices.do?iscrypt=1'
function fInput() {
    $('#frontcard_file').click()
}

function bInput() {
    $('#backcard_file').click()
}
$(function() {
    $('.back-cbr-list').hide()
})

/**
 * mock参保人列表
 */
var mockCbr = {
    "returnCode": "1",
    "returnMsg": "success",
    "returnParams": [{
        "universalid": 910387982011200,
        "user_name": "娴嬭瘯鍙備繚浜�",
        "user_state": 1,
        "contact_tel": "1",
        "idnum": "2",
        "email": "5",
        "registercity": "3",
        "postcode": "4",
        "companyId": 3,
        "createTime": {
            "date": 2,
            "day": 4,
            "hours": 14,
            "minutes": 34,
            "month": 0,
            "nanos": 0,
            "seconds": 6,
            "time": 1577946846000,
            "timezoneOffset": -480,
            "year": 120
        },
        "unitId": 1358903647341,
        "parentId": 874414223138678,
        "usertype": "1",
        "loginStyle": "0",
        "delete_symbol": "0",
        "loginType": "2",
        "orderCount": 0
    }, {
        "universalid": 910557474158100,
        "user_name": "鏂板鍙備繚浜�",
        "user_state": 1,
        "contact_tel": "110",
        "idnum": "111",
        "email": "aaaa",
        "registercity": "绂忓窞",
        "postcode": "鍐滄潙",
        "companyId": 3,
        "createTime": {
            "date": 2,
            "day": 4,
            "hours": 14,
            "minutes": 36,
            "month": 0,
            "nanos": 0,
            "seconds": 56,
            "time": 1577947016000,
            "timezoneOffset": -480,
            "year": 120
        },
        "unitId": 1358903647341,
        "parentId": 874414223138678,
        "usertype": "1",
        "loginStyle": "0",
        "delete_symbol": "0",
        "loginType": "2",
        "orderCount": 0
    }]
}


/**
 * mock提交
 */
var mockCbrForm = {

    "data": { //生成|num个如下格式名字的数据
        "code": 200

    }

}

$(function() {
    if (sessionStorage.getItem('centerTab') == 1) {
        initCbrList()
    }
})

/**
 * 我的参保人
 */

function initCbrList() {
    // Mock.mock('https://api/center/cbrList', mockCbr)
    // openPreloader()
    $.ajax({
        url: baseUrl,
        type: 'post',
        contentType: 'application/json; charset=utf-8',
        data: `{"serviceId":"eu_2013V01myInsureApi","params": {"useId": ${JSON.parse(sessionStorage.getItem('login')).useId}}}`,
        success: function(data) {
            $('#cbr-list').html('')
            console.log(JSON.parse(data));
            if (JSON.parse(data).returnCode == 0) {
                var content = `<div class="fr-center-message-div" style="text-align: center;margin-top:20%">
					<img src="./images/center-message.png" />
				</div>`
            } else {
                var allCbrs = JSON.parse(data).returnParams
                var content = ''
                for (let i = 0; i < allCbrs.length; i++) {
                    content +=
                        `
								<div class="cbr-item">
									<div class="row cbr-title">
										<div class="column" style="align-items: flex-start;">
											<div class="sb-row"><span>姓名:</span><span>${allCbrs[i].user_name}</span></div>
										</div>
										
									</div>
									<div class="row cbr-body">
									<div>
										<div class="sb-row"><span>户口信息:</span><span>${allCbrs[i].registercity} ${allCbrs[i].postcode}</span></div>
										<div class="sb-row"><span>身份证号:</span><span>${allCbrs[i].idnum}</span></div>
									</div>
									<div>
										<div class="sb-row"><span>社保状态: </span>${allCbrs[i].loginStyle == '0'?'<span style="color:rgb(27,155, 227)">未参保</span>':'<span style="color:rgb(48,192,88)">已参保</span>'}</div>
										
									</div>
									</div>
									<div class="row cbr-footer">
										<img src="images/delete.png" width="30">
										<div class="">
											
											<button type="button" onclick="buySb(${allCbrs[i].universalid})" class="btn btn-primary mobile-btn btn-sm">买社保</button>
										</div>
									</div>
								</div>
								`

                }
            }
            $('#cbr-list').html(content)
                // handlePreloader()
        }
    })
}

function buySb(uid) {
	console.log(uid)
    window.parent.location.href = 'person-sb.html'
}

function addCbr() {
    $('#cbr').attr('style', 'display: none')
    $('#addCbr').attr('style', 'display: block')

    $('.back-cbr-list').show()
    $('.add-cbr').hide()
}


function backCbrList() {
    $('#cbr').attr('style', 'display: block')
    $('#addCbr').attr('style', 'display: none')

    $('.back-cbr-list').hide()
    $('.add-cbr').show()
}
var data = {};

function cbrSave() {
    var t = $('#cbrForm').serializeArray();
    $.each(t, function() {
        if (!this.value) {
            diyAlert('信息不完整,请检查', 'warning', 1)
            return
        }
        data[this.name] = this.value;
    });
    console.log(!$('#frontcard_file').val() || !$('#backcard_file').val())
    if (!$('#frontcard_file').val() || !$('#backcard_file').val()) {
        // alert('身份证照片信息有误')
        diyAlert('身份证照片不能为空', 'warning', 1)
        return
    }
    let user = JSON.parse(sessionStorage.getItem('login'))
    data.unitId = user.unitId
    data.useId = user.useId
    data.idPicFront = fontFileId
    data.idPicBack = backFileId
    console.log(JSON.stringify(data))
    let allParams = `{"serviceId":"eu_2013V01addInsureApi",'params':${JSON.stringify(data)}}`
    console.log(fontFileId, backFileId)
        // alert('提交成功')
        // Mock.mock('https://api/center/addCbr', mockCbrForm)
    btnDisabled('#cbrSaveBtn', '保存中...', 'on')
    $.ajax({
        url: baseUrl,
        type: "POST",
        contentType: "application/json; charset=UTF-8",
        dataType: 'json',
        // jsonp: "callback",
        // async: false,
        data: allParams,
        success: function(data) {
            if (data.returnCode == 1) {
                // alert('新增参保人成功')
                diyAlert('新增参保人成功', 'success', 1)
                btnDisabled('#cbrSaveBtn', '保存', 'off')
                initCbrList()
                $('#cbr').attr('style', 'display: block')
                $('#addCbr').attr('style', 'display: none')
            } else {
                diyAlert('保存失败,请检查后重试', 'warning', 1)
                btnDisabled('#cbrSaveBtn', '保存', 'off')
            }

        },
        error: function() {
            btnDisabled('#cbrSaveBtn', '保存', 'off')
            diyAlert('网络错误', 'warning', 1)
        }
    })
}

function toOrderList() {
    console.log(top.location.href)
    window.top.location.href = 'center.html'
}