// 界面切换
const cards = document.querySelectorAll('.card');
const btns = document.querySelectorAll('.js-btn');
btns.forEach(btn => {
    btn.addEventListener('click', on_btn_click, true);
    btn.addEventListener('touch', on_btn_click, true);
});

function on_btn_click(e) {
    const nextID = e.currentTarget.getAttribute('data-target');
    const next = document.getElementById(nextID);
    if (!next) return;
    // bg_change(nextID);
    view_change(next);
    return false;
}

function bg_change(next) {
    document.body.className = '';
    document.body.classList.add('is-' + next);
}

function view_change(next) {
    cards.forEach(card => {
        card.classList.remove('is-show');
    });
    next.classList.add('is-show');
    $("#registerForm")[0].reset();
    $("#loginForm")[0].reset();
}
// var obj = {'aa':'11', 'bb':'22', 'cc':'33', 'dd':'44'};

var cwidth = document.body.clientWidth
    // 移动端判断 
$(
    function() {
        if (cwidth < 750) {
            if (sessionStorage.getItem('login')) {
                $('#userInfo').hide()
            } else {
                $('#userInfo').show()
            }
            $('.user-li').hide()
        } else {

        }
    }
)

// Mock响应模板
Mock.mock('http://test.com', {
    "returnParams": `{
	"address": "",
	"backcard": "",
	"backcardUrl": "",
	"birthday": "",
	"cityname": "",
	"companyId": 3,
	"companyName": "",
	"contact_tel1": "15005919722",
	"createTime": null,
	"deleteSymbol": "",
	"deptName": "g15005919722",
	"desktop_phone": "",
	"email": "",
	"fax": "",
	"fixed_phone": "",
	"frontcard": "",
	"frontcardUrl": "",
	"groupNum": "",
	"groupid": "874414215856545",
	"gxId": "874414254643750",
	"hukouCategory": "",
	"isAll": "",
	"loginStyle": "",
	"loginType": "0",
	"msnnum": "",
	"name": "yy15005919722",
	"password": "",
	"pos": 0,
	"position": "",
	"postcode": "",
	"province": "",
	"provincename": "",
	"qqnum": "",
	"rePassword": "",
	"recMail": "",
	"recMsg": "",
	"recSms": "",
	"registerType": "",
	"registrationnum": "",
	"sex": "",
	"unEncryptPassword": "",
	"unitId": 1358903647341,
	"useId": 874414223138678,
	"userInfo": null,
	"userName": "15005919722",
	"userState": "1",
	"weixin": "oXf7djgrhvu2ojmJS5V8hxuKUYTo",
	"entCode": ""
}`
});
$(function() {
    var user = sessionStorage.getItem('login') || null
    if (user) {
        $('.login-li').hide()
        if (cwidth < 750) {
            $('#userInfo').show()
            $('#mobUsername').text(JSON.parse(user).name)
        } else {
            console.log(JSON.parse(user).name, $('#pcUsername'))
            $('.user-li').show()
            $('#pcUsername').text(JSON.parse(user).name)
            $('.ps-info').show()
        }
    } else {
        $('.login-li').show()
        if (cwidth < 750) {
            $('#userInfo').hide()
        } else {

            $('.user-li').hide()
            $('.logout').hide()
            $('.ps-info').hide()
        }
    }
})

$('.log-btn').click(() => {

    let userName = $("input[name='logUserName']").val(),
        password = $("input[name='logPassword']").val()
    btnDisabled('.log-btn', '登录中...', 'on')
    $.ajax({
        url: baseUrl,
        // url: 'http://test.com',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        data: `{"serviceId":"eu_2013V01loginApi","params": {"username": "${userName}","password":"${password}"}}`,
        dataType: 'json'
    }).done(function(data, status, xhr) {
        console.log(data)
        if (data.returnCode == 1) {
            diyAlert('登录成功', 'success')
            btnDisabled('.log-btn', '登录', 'off')
            setTimeout(() => {
                let userInfo = data.returnParams
                sessionStorage.setItem('login', JSON.stringify(data.returnParams))
                location.reload()
                $('#userInfo').show()
                $('.login-li').hide()
                $('.user-li').show()
                $('.ps-info').show()
                $('.user-li').find('a').eq(0).text(`${userInfo.userName}`)
                $('.logout').show()
                $('#myModal').modal('hide')
            }, 1000)
        } else {
            diyAlert('登录失败', 'warning')
            btnDisabled('.log-btn', '登录', 'off')
        }


    }).fail(() => {
        diyAlert('网络错误', 'warning')
        btnDisabled('.log-btn', '登录', 'off')
    });
})

// function btnDisabled(element, text, state) {
// 	var btn = $(element);
// 	console.log(btn)
// 	btn.text(text)
// 	if (state == 'off') {
// 		btn.removeAttr("disabled")
// 	} else{
// 		btn.attr("disabled", "disabled")
// 	}

// }

$('.reg-btn').click(() => {
    let userName = $("input[name='userName']").val(),
        password = $("input[name='password']").val(),
        email = $("input[name='email']").val(),
        vcode = $("input[name='vcode']").val()
    if (!userName || !password) {
        return
    }
    if ($("input[name='password']").val() != $("input[name='ensurePassword']").val()) {
        // alert('2次输入密码不一致,请检查')
        diyAlert('2次输入密码不一致,请检查', 'warning')
        return
    }
    btnDisabled('.reg-btn', '注册中...', 'on')
    $.ajax({
        url: baseUrl,
        // url: 'http://test.com',
        type: 'post',
        contentType: "application/json; charset=utf-8",
        data: `{"serviceId":"eu_2013V01registerUserApi","params": {"account": "${userName}","password":"${password}","email":"${email}","vcode":${vcode}}}`,
        dataType: 'json',
        success: function(data, status, xhr) {
            if (data.returnCode == '1') {
                diyAlert('注册成功', 'success')
                btnDisabled('.reg-btn', '注册', 'off')

            } else {
                diyAlert(data.returnParams, 'warning')
                btnDisabled('.reg-btn', '注册', 'off')
            }
        },
        error: function() {
            diyAlert('网络错误', 'warning')
            btnDisabled('.reg-btn', '注册', 'off')
        }
    });
})

function toUserInfo() {
    window.location.href = 'person-gr-info.html'
}

$('.logout').click(() => {
    sessionStorage.removeItem('login')
    window.location.href = 'index.html'
})