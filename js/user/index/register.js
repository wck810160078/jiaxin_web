/*
函数名称：isPhoneNumber
函数作用：判断id为phonenumber_id的输入框内容是否为手机号码
参数说明：无
*/
function isPhoneNumber() {
	var theinput = $("#phonenumber_id").val() ;
	var p1 = /^(13[0-9]\d{8}|15[0-35-9]\d{8}|18[0-9]\d{8}|14[57]\d{8})$/ ;
	if(p1.test(theinput)==false) {
		alert('请填写正确电话号码!!') ;		  
		$("#phonenumber_id").val("") ;
	}
}
/*
函数名称：isNotNull
函数作用：判断是否为空
参数说明：无
*/
function isNotNull() {
	if($('#phonenumber_id').val() == "" || $('#password_id').val() == "" || $('#confirmpassword_id').val() == "") {
		alert("信息不能为空！") ;
		return false;
	}
	if(isSame()) {
		return true ;
	}
}
/*
函数名称：isSame
函数作用：判断id为password_id与confirmpassword_id两个文本框内容是否相同
参数说明：无
*/
function isSame() {
	if($('#password_id').val() == $('#confirmpassword_id').val()) {
		return true ;
	}
	alert("确认密码与密码不一致！") ;
	$('#confirmpassword_id').val("") ;
	return false ;
}
/*
函数名称：register
函数作用：调用insertUser接口进行用户注册
参数说明：无
*/
function register() {
	var data = formDataToJsonDate('#registerForm_id');
	console.log(data);
	$.ajax({
		type:"post",
		url:url+"/register",
		async:true,
		dataType:"json",
		data:JSON.stringify(formDataToJsonDate('#registerForm_id')),
		contentType:"application/json",
		success:function(result) {
			if(result.stateCode == 200) {
				toastr.success("注册成功") ;
				window.location.href = "login.html";
			}else{
				toastr.warning(result.info) ;
			}
		},
		error:function() {
			alert("注册失败！") ;
		}
	});
}
$(function(){
	
	$('#registerSubmit_id').click(function(){
		register()
	});
	/*
	函数作用：点击id为registerSubmit_id的button后先调用selectByPhone判断该号码是否已存在，若不存在则调用insertUser继续注册
	参数说明：无
	*/
	/*$("#registerSubmit_id").click(function(){
		var b = isNotNull() ;
		if(b) {
			var phonenumber = $('#phonenumber_id').val() ;
			$.ajax({
				type:"post",
				//url:"http://127.0.0.1:8080/selectByPhone?phonenumber="+phonenumber,
				url:"http://127.0.0.1:8080/selectByPhone",
				async:true,
				data:{"phonenumber":phonenumber} ,
				success:function(result) {
					console.log(result) ;
					if(result.code == 200 && result.messageCn == "true") {
						alert("该手机号码已注册！") ;
						$('#phonenumber_id').val("") ;
					}else if(result.messageCn == "false" && result.code == 200){
						register() ;
					}
				},
				error:function() {
					alert("注册失败!") ;
				}
			});
		}
		
	});*/
});