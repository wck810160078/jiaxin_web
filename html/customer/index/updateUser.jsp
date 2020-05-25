<%@page import="com.java.entity.User"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
</head>
<body>
<% User user = (User)request.getAttribute("queryUserByUser_id") ; %>
	<form action="updateUser">
		<table border="1">
			<tr style="display: none;">
				<td>
					id：
				</td>
				<td>
					<input name="userid" readonly="readonly" value="<%=user.getUserid()%>" />
				</td>
			</tr>
			<tr>
				<td>
					用户名：
				</td>
				<td>
					<input name="username" readonly="readonly" value="<%=user.getUsername()%>" />
				</td>
			</tr>
			<tr>
				<td>
					手机号码：
				</td>
				<td>
					<input name="phonenumber" readonly="readonly" value="<%=user.getPhonenumber()%>" />
				</td>
			</tr>
			<tr>
				<td>
					用户标签：
				</td>
				<td>
					<input type="text" name="userlabel" value="<%=user.getUserlabel()%>" />
				</td>
			</tr>
			<tr>
				<td>
					备注：
				</td>
				<td>
					<input type="text" name="remark" value="<%=user.getRemark()%>" />
				</td>
			</tr>
			<tr>
				<td colspan="2" style="text-align: center;">
					<input type="submit" value="提交" />
				</td>
			</tr>
		</table>
		
	</form>
</body>
</html>