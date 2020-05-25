<%@page import="com.java.entity.DictType"%>
<%@page import="java.util.List"%>
<%@ page language="java" contentType="text/html; charset=utf-8"
    pageEncoding="utf-8"%>
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<title>Insert title here</title>
</head>
<body>
	<table border="1">
		<tr>
			<td colspan="3">
				<a href="adddictTypes.jsp">新增</a>
			</td>
		</tr>
		<tr>
			<td>数据字典类型编码</td>
			<td>数据字典类型名称</td>
			<td>备注</td>
		</tr>
		<%
			List<DictType> dictTypes = (List<DictType>) request.getAttribute("dictType");
			for (DictType dictType : dictTypes) {
		%>
		<tr>
			<td style="display: none;"><%=dictType.getDicttypeid()%></td>
			<td><%=dictType.getDictcode()%></td>
			<td><%=dictType.getDictname()%></td>
			<td><%=dictType.getRemark()%></td>
		</tr>
		<%
			}
		%>
	</table>
</body>
</html>