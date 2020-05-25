$(function() {
	/*
	函数名称：
	函数作用：调用selectAllDictInfo查询所有数据字典明细信息
	参数说明：无
	*/
	$.ajax({
		url: "http://127.0.0.1:8080/selectAllDictInfo",
		type: "post",
		dataType: "json",
		success: function(data) {
			$('#dictInfoTab_id').bootstrapTable({
				data: data.response,
				undefinedText: "——", //当数据为 undefined 时显示的字符。
				sidePagination: 'client',
				pagination: true, //是否显示分页（*）
				/* 右上角工具条 */
				//showRefresh: true, //显示刷新按钮
				//showToggle: true, //是否显示详细视图和列表视图的切换按钮
				//showColumns: true, //显示下拉框勾选要显示的列 
				pagination: true, //在表格底部显示分页工具栏  
				striped: true, //是否显示行间隔色
				pageNumber: 1, //当前第几页 
				pageSize: 5, //每页显示的记录数 
				pageList: [5, 10, 15, 20, 25], //记录数可选列表 
				toolbar: "#toolbar", //设置工具栏的Id或者class 
				paginationPreText: "上一页",
				paginationNextText: "下一页",
				sortable: true,                     //是否启用排序
				clickToSelect: true,    //点击行即可选中单选/复选框 
				//iconSize: "outline", 
				//cardView: false,//设置为True时显示名片（card）布局 
				singleSelect: false,//复选框只能选择一条记录
				//search: true, //是否显示右上角的搜索框  
				formatLoadingMessage: function() {
					return "请稍等，正在加载中...";
				},
				icons: {
					refresh: "glyphicon-repeat",
					toggle: "glyphicon-list-alt"
				},
				columns: [{
					field : 'number',
					title : '行号',
					align: 'center',
					formatter : function(value, row, index) {
//							var page = $('#dictInfoTab_id').bootstrapTable("getOptions");
//							return page.pageSize * (page.pageNumber - 1) + index + 1;
						var pageSize=$('#dictInfoTab_id').bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
//						console.log($('#dictInfoTab_id').bootstrapTable('getOptions'));
		                var pageNumber=$('#dictInfoTab_id').bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
		                return Number(pageSize * (pageNumber - 1) + index + 1) ;//返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
					}
				},{
					checkbox: true
				},{
					field: 'dictinfoId',
					align: 'center',
					visible: false //不显示
				}, {
					field: 'dictName',
					title: '数据字典类型名称',
					align: 'center',
				}, {
					field: 'dictInfo',
					title: '数据字典明细内容',
					align: 'center',
				}, {
					field: 'state',
					title: '状态',
					align: 'center',
					formatter: function(value, row, index) {
						return value == "open" ? "开启" : "关闭";
					}
				}, {
					title: '操作',
					align: 'center',
					formatter: function(value, row, index) {
						var open = "<input type='button' id=" + row["dictinfoId"] + " class='changeDictInfoState_class' onclick='changeDictInfoState(" + row['dictinfoId'] + ")' value='开启'>";
						var close = "<input type='button' id=" + row["dictinfoId"] + " class='changeDictInfoState_class' onclick='changeDictInfoState(" + row['dictinfoId'] + ")' value='关闭'>";
						return row["state"] == "open" ? close : open;
					}
				}]
			});
		},
		error: function(data) {
//			alert("ajax连接异常!");
		}
	});
	$('#adddictInfoBut_id').click(function() {
		window.location.href = "adddictInfo.html";
	});
});
/*
函数名称：changeDictInfoState
函数作用：调用changeDictInfoState修改数据字典明细信息状态
参数说明：dictinfoId：数据字典明细信息id
*/
function changeDictInfoState(dictinfoId) {
	$.ajax({
		type: "post",
		url: "http://127.0.0.1:8080/changeDictInfoState",
		async: true,
		data: {
			"dictinfoId": dictinfoId
		},
		success: function(data) {
			console.log(data.response);
			$('#state' + dictinfoId).text(data.response);
			if(data.response == "open") {
				$('#' + dictinfoId).val("关闭");
			} else if(data.response == "close") {
				$('#' + dictinfoId).val("开启");
			}
			window.location.reload();
		},
		error: function() {
			alert("修改失败！");
		}
	});
};
