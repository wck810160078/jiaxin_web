<%@page import="com.java.entity.User"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
	pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
<script type="text/javascript" src="<%=request.getContextPath()%>/js/jquery-1.10.2.min.js"></script>
</head>


<body>
<% 
	/* 获取后台传送的数据显示条数 */
	int pageSize = Integer.parseInt(request.getAttribute("pageSize").toString()) ;
	/* 获取当前页码 */
	int pageNow = Integer.parseInt(request.getAttribute("page").toString()) ;
	/* 获取数据总条数 */
	int userTotal = Integer.parseInt(request.getAttribute("userTotal").toString()) ;
	/* 获取模糊查询条件 */
	Object object = request.getAttribute("searchInfo") ;
	String searchInfo = "" ;
	if(object!=null) {
		searchInfo = object.toString() ;
	}
	/* 获取数据总条数 */
	String chooseUserState = request.getAttribute("chooseUserState").toString() ;
%>
	<table border="1">
		<tr style="text-align:right;">
			<td>
				<input type="checkbox" id="chooseUserStateInput"  name="chooseUserState" onclick="userLabelChoose()" />仅显示使用中用户
			</td>
			<td>
				用户标签：<select id="filterUserLabel" ></select>
				<script type="text/javascript">
					$(document).ready(function () {
						$.ajax({
							url : '${pageContext.request.contextPath}/queryAllDictInfoByDictTypeToJson',
							type : 'POST',
							async : false,
							data : 'userLabel',
							dataType:'json',
							success: function (userLabelData) {
								alert("1") ;
								alert("userLabelData.length:"+userLabelData.length) ;
								alert(userLabelData.list) ;
								for(var i = 0 ; i < userLabelData.length ; i++) {
									$("#filterUserLabel").append("<option value="+userLabelData[i].dictinfo+">"+userLabelData[i].dictinfo+"</option>") ;
								} 
					        },  
							error : function(userLabelData) {
								alert(userLabelData) ;
								alert("userLabelData.list:"+userLabelData[1]) ;
								console.log(userLabelData);//可以在控制台查看打印的data值
							}
						});
					});
				</script>
			</td>
			<td>
				<input type="button" value="导出" onclick="xslx('exportUser')" />
				<!-- <form action="uploadUserInfo" method="post" enctype="multipart/form-data">
					<input type="file" name="filename" value="导入"  />
				    <button type="submit">提交</button>
				</form> -->
				<form id="uploadForm" method="post"  enctype="multipart/form-data">  
					<input id="uploadfile" type="file" name="filename" value="导入"  />
					<input type="button" value="上传" onclick="xslx('importUser')" />
				</form> 
			</td>
			<td colspan="3">
				<input id="searchInput" placeholder="用户名/手机号码/备注" value="<%=searchInfo %>"  />
				<input type="button" value="搜索" onclick="fuzzySearch()" />
			</td>
		</tr>
		<tr>
			<td>用户名</td>
			<td>手机号码</td>
			<td>用户标签</td>
			<td>状态</td>
			<td>备注</td>
			<td>操作</td>
		</tr>
		<%
			List<User> users = (List<User>) request.getAttribute("user");
			for (User user : users) {
		%>
		<tr>
			<td style="display: none;"><%=user.getUserid()%></td>
			<td><%=user.getUsername()%></td>
			<td><%=user.getPhonenumber()%></td>
			<td><%=user.getUserlabel()%></td>
			<td class="userState"><%=user.getState()%></td>
			<td><%=user.getRemark()%></td>
			<td><a href="<%=request.getContextPath()%>/queryUserByUser_id?user_id=<%=user.getUserid()%>">修改</a> 
				<a href="<%=request.getContextPath()%>/deleteUserById?user_id=<%=user.getUserid()%>">
					<input type="button" class="changeUserState" value="<%=user.getState()%>" />
				</a>
			</td>
		</tr>
		<%
			}
		%>
		<tr>
			<td>
				显示<select id="pageSize" onchange="chagePageSize()" >
						<option value="10">10</option>
						<option value="15">15</option>
						<option value="20">20</option>
				   </select>条
			</td>
			<td colspan="4" style="text-align: center;">
				<input type="button" value="首页" onclick="changePage('first')" />
				<input type="button" value="上一页" onclick="changePage('previous')" />
				当前第<input value="<%=pageNow %>" id="page" style="width: 30px;text-align: center;" onchange="chagePageInput()"  />页
				<input type="button" value="下一页" onclick="changePage('next')" />
				<input type="button" value="尾页" onclick="changePage('last')" />
			</td>
			
			<td>
				共
				<span id="userTotal"><%=userTotal%></span>
				条记录
			</td>
		</tr>
	</table>
	<a href="<%=request.getContextPath()%>/index.jsp">index</a>
</body>
<script type="text/javascript">
	/* 模糊查询条件 */
	var searchInput = $("#searchInput").val() ;
	/* 数据总条数 */
	var userTotal = $("#userTotal").text() ;
	//alert("方法外："+userTotal) ;
	$(function(){
		/* 用户信息状态（数组） */
		var userState = $(".userState") ;
		/* 遍历用户信息状态 */
		userState.each(function(index,value){
			if(value.innerHTML=="open") {
				value.innerHTML = "使用中" ;
			}else {
				value.innerHTML = "已停用" ;
			}
		} );
		/* 停用（启用）按钮状态（数组） */
		var userStateInput = $(".changeUserState");
		userStateInput.each(function(index,value){
			if(value.value=="close"){
				value.value = "启用";
			}else{
				value.value = "停用";
			}
		});
		
		var opt = $("#pageSize option");
		opt.each(function(index,value){
			if($(value).val()=='<%=pageSize%>' ){
				value.selected = true;
			}
		});
		if('<%=chooseUserState%>'=="true") {
			$("#chooseUserStateInput").prop("checked",true);
		}
	}) 
		/* 修改当前每页显示条数 */
		function chagePageSize() {
			/* 当前页码 */
			var page = $("#page").val() ;
			page = parseInt(page) ;
			/* 当前每页显示条数 */
			var pageSize = $("#pageSize").val() ;
			/* 数据总条数 */
			var userTotal = $("#userTotal").text() ;
			/* 最大页码数 */
			var pageMax = Math.ceil(userTotal/pageSize) ;
			/* 模糊查询条件 */
			var searchInput = $("#searchInput").val() ;
			/* 获取状态 */
			var chooseUserStateInput = $("#chooseUserStateInput") ;
			var chooseUserState = chooseUserStateInput.is(':checked') ;
			if((userTotal <= pageSize )|| (page < 1) || (page > pageMax) || (isNaN(page))) {
				page = 1
			}
				window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
		}
		/* 跳页 */
		function changePage(method) {
			/* 当前页码 */
			var page = $("#page").val() ;
			page = parseInt(page) ;
			/* 当前每页显示条数 */
			var pageSize = $("#pageSize").val() ;
			/* 数据总条数 */
			var userTotal = $("#userTotal").text() ;
			/* 最大页码数 */
			var pageMax = Math.ceil(userTotal/pageSize) ;
			/* 模糊查询条件 */
			var searchInput = $("#searchInput").val() ;
			/* 获取状态 */
			var chooseUserStateInput = $("#chooseUserStateInput") ;
			var chooseUserState = chooseUserStateInput.is(':checked') ;
			switch (method) {
			case "next":
				if(page < pageMax) {
					page = page + 1 ;
					window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
				}
				break;
				
			case "previous":
				if(page > 1) {
					page = page - 1 ;
					window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
				}
				break;
				
			case "first":
				page = 1 ;
				window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
				break;
				
			case "last":
				window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+pageMax+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ; 
				break;

			default:
				break;
			}
		}
		
		/* 手动修改当前页码 */
		function chagePageInput() {
			/* 当前页码 */
			var page = $("#page").val() ;
			page = parseInt(page) ;
			/* 当前每页显示条数 */
			var pageSize = $("#pageSize").val() ;
			/* 数据总条数 */
			var userTotal = $("#userTotal").text() ;
			/* 最大页码数 */
			var pageMax = Math.ceil(userTotal/pageSize) ;
			/* 模糊查询条件 */
			var searchInput = $("#searchInput").val() ;
			/* 获取状态 */
			var chooseUserStateInput = $("#chooseUserStateInput") ;
			var chooseUserState = chooseUserStateInput.is(':checked') ;
			if((userTotal <= pageSize )|| (page < 1) || (page > pageMax) || (isNaN(page))) {
				page = 1
			}
			window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page+'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
		}
		
		/* 模糊查询 */
		function fuzzySearch() {
			/* 当前页码 */
			var page = $("#page").val() ;
			page = parseInt(page) ;
			/* 当前每页显示条数 */
			var pageSize = $("#pageSize").val() ;
			/* 数据总条数 */
			var userTotal = $("#userTotal").text() ;
			/* 最大页码数 */
			var pageMax = Math.ceil(userTotal/pageSize) ;
			/* 模糊查询条件 */
			var searchInput = $("#searchInput").val() ;
			/* 获取状态 */
			var chooseUserStateInput = $("#chooseUserStateInput") ;
			var chooseUserState = chooseUserStateInput.is(':checked') ;
			window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page +'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
		}
		
		/* 仅显示使用中客户 */
		function userLabelChoose() {
			/* 当前页码 */
			var page = $("#page").val() ;
			page = parseInt(page) ;
			/* 当前每页显示条数 */
			var pageSize = $("#pageSize").val() ;
			/* 数据总条数 */
			//var userTotal = $("#userTotal").text() ;
			//alert("方法里："+userTotal) ;
			/* 最大页码数 */
			var pageMax = Math.ceil(userTotal/pageSize) ;
			/* 模糊查询条件 */
			var searchInput = $("#searchInput").val() ;
			/* 获取状态 */
			var chooseUserStateInput = $("#chooseUserStateInput") ;
			var chooseUserState = chooseUserStateInput.is(':checked') ;
			//alert("(userTotal"+userTotal+" <= pageSize"+pageSize+" ):"+(userTotal <= pageSize )) ;
			if((userTotal <= pageSize )|| (page < 1) || (page > pageMax) || (isNaN(page))) {
				page = 1
			}
			window.location.href = "${pageContext.request.contextPath}/queryAllUser?page="+page +'&pageSize='+pageSize +'&searchInfo='+searchInput +'&chooseUserState='+chooseUserState ;
		}
		
		/* 导入/导出 */
		function xslx(method) {
			/* 导出 */
			if(method=="exportUser") {
				window.location.href = "${pageContext.request.contextPath}/downloadUserInfo" ;
			}else if (method == "importUser"){
				/* 导入 */
				var formData = new FormData();
				var name = $("#uploadfile").val();
				formData.append("file", $("#uploadfile")[0].files[0]);
				formData.append("name", name);//这个地方可以传递多个参数
				$.ajax({
					url : '${pageContext.request.contextPath}/uploadUserInfo',
					type : 'POST',
					async : false,
					data : formData,
					// 告诉jQuery不要去处理发送的数据
					processData : false,
					// 告诉jQuery不要去设置Content-Type请求头
					contentType : false,
					dataType:'text',
					/* beforeSend:function(){
			            console.log("正在进行，请稍候");
			        }, */
					 success: function (returndata) { 
			              alert(returndata);  
			          },  
			          error: function (returndata) { 
			console.log(returndata);//可以在控制台查看打印的data值
				if(returndata.readyState != "4" && returndata.status != "200") {
			              alert("失败");  
				}
			          } 
				});
			}
		}
		
		function doUpload() {
			var formData = new FormData();
			var name = $("#uploadfile").val();
			formData.append("file", $("#uploadfile")[0].files[0]);
			formData.append("name", name);//这个地方可以传递多个参数
			$.ajax({
				url : '${pageContext.request.contextPath}/uploadUserInfo',
				type : 'POST',
				async : false,
				data : formData,
				// 告诉jQuery不要去处理发送的数据
				processData : false,
				// 告诉jQuery不要去设置Content-Type请求头
				contentType : false,
				dataType : 'text',
				success : function(returndata) {
					alert(returndata);
				},
				error : function(returndata) {
					console.log(returndata);//可以在控制台查看打印的data值
					if (returndata.readyState != "4" && returndata.status != "200") {
						alert(returndata);
					}
				}
			});
		}
</script>
</html>