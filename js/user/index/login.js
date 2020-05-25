/*
函数名称：isNotNull
函数作用：判断是否为空
参数说明：无
*/
function isNotNull() {
	if($('#username_id').val() == "" || $('#password_id').val() == "") {
		alert("账号或密码不能为空！") ;
		return false ;
	}
	return true ;
}
$(function(){
	/*
	函数作用：点击id为loginSubmit_id的button后先调用selectByAccountAndPassword判断账号密码是否匹配
	参数说明：无
	*/
	$('#loginSubmit_id').click(function(){
		var b = isNotNull() ;
		if(b) {
			$.ajax({
				type:"post",
				url:url+"/login",
				data:$("#loginForm_id").serialize(),
				async:true,
				success:function(result){
					if(result.code == 10000){
						toastr.success(result.message) ;
						if(result.resp==2){
							window.location.href = "../../../html/user/main/userMain.html" ;
						}else{
							window.location.href = "../../../html/manager/main/starter.html" ;
						}
						
					}else {
						toastr.warning(result.message) ;
						$('#username_id').val("") ;
						$('#password_id').val("") ;
					}
					
				},
				error:function(){
					alert("登陆失败！") ;
				}
			});
		}
	});
}) ;
