$(function(){
	/*
	函数作用：调用selectAllDictType查询所有数据字典类型
	参数说明：无
	*/
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/selectAllDictType",
		async:true,
		dataType:"json",
		success:function(result){
			showData(result) ;
		},
		error: function(result){
     		alert("ajax连接异常!");
     	}
	});
	/*
	函数作用：点击id为addDictInfoSubmit_id的button后调用addDictInfo添加数据字典明细信息
	参数说明：无
	*/
	$("#addDictInfoSubmit_id").click(function(){
		var b = isNotNull() ;
		if(b) {
			$.ajax({
				type:"post",
				url:"http://127.0.0.1:8080/insertDictInfo",
				async:true,
				dataType:"json",
				data:$('#addDictInfoForm_id').serialize() ,
				success:function(result) {
					if(result.code == 200 && result.state == "success") {
						//alert("添加成功！") ;
						window.location.href = "queryAllDictInfo.html" ;
					}else if(result.state  == "false" && result.code == 200){
						alert("添加失败！") ;
					}
				},
				error:function() {
					alert("添加失败!") ;
				}
			});
		}
		
	});
});
/*
函数名称：isNotNull
函数作用：判断是否为空
参数说明：无
*/
function isNotNull() {
	if($('#dictName_id').val() == "" || $('#dictInfo_id').val() == "" || $('#state_id').val() == "" || $('#remark_id').val() == "") {
		alert("信息不能为空！") ;
		return false;
	}
	return true ;
}
/*
函数名称：showData
函数作用：拼接select，展示数据
参数说明：result：通过ajax调用selectAllDictType接收到的所有数据字典类型
*/
function showData(result) {
	var str = "" ;
	$(result).each(function(index,value){
		str = "<option value='"+value.dicttypeId+"'>"+value.dictName+"</option>" ;
		$('#dictName_id').append(str);
	});
}
