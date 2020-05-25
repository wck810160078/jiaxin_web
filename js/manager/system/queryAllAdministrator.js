//$(function(){
//	/*$.ajax({
//		type:"post",
//		url:"",
//		async:true,
//		dataType:"json",
//		success : function(data){*/
//			$('#administratorTab_id').bootstrapTable({
//				/*data:data.response,*/
//				undefinedText: "——", //当数据为 undefined 时显示的字符。
//				sidePagination: 'client',
//				pagination: true, //是否显示分页（*）
//				/* 右上角工具条 */
//				//showRefresh: true, //显示刷新按钮
//				//showToggle: true, //是否显示详细视图和列表视图的切换按钮
//				//showColumns: true, //显示下拉框勾选要显示的列 
//				pagination: true, //在表格底部显示分页工具栏  
//				striped: true, //是否显示行间隔色
//				pageNumber: 1, //当前第几页 
//				pageSize: 5, //每页显示的记录数 
//				pageList: [5, 10, 15, 20, 25], //记录数可选列表 
//				//toolbar: "#toolbar", //设置工具栏的Id或者class 
//				paginationPreText: "上一页",
//				paginationNextText: "下一页",
//				//clickToSelect: true,    //点击行即可选中单选/复选框 
//				//iconSize: "outline", 
//				//cardView: false,//设置为True时显示名片（card）布局 
//				// singleSelect: true,//复选框只能选择一条记录
//				//search: true, //是否显示右上角的搜索框
//				formatLoadingMessage: function() {
//					return "请稍等，正在加载中...";
//				},
//				icons: {
//					refresh: "glyphicon-repeat",
//					toggle: "glyphicon-list-alt"
//				},
//				columns: [{
//						//field: 'dictinfoId',
//						visible: false //不显示
//					}, {
//						//field: 'dictName',
//						title: '管理员名称',
//						align: 'center',
//					}, {
//						//field: 'dictInfo',
//						title: '手机号码',
//						align: 'center',
//					}, {
//						//field: 'state',
//						title: '状态',
//						align: 'center',
//						formatter: function(value, row, index) {
//							return value == "open" ? "开启" : "关闭";
//						}
//					}, {
//						title: '操作',
//						align: 'center',
//						formatter: function(value, row, index) {
//							var open = "<input type='button' id=" + row["dictinfoId"] + " class='changeDictInfoState_class' onclick='changeDictInfoState(" + row['dictinfoId'] + ")' value='开启'>";
//							var close = "<input type='button' id=" + row["dictinfoId"] + " class='changeDictInfoState_class' onclick='changeDictInfoState(" + row['dictinfoId'] + ")' value='关闭'>";
//							return row["state"] == "open" ? close : open;
//						}
//					}
//				]
//			});
//		/*},
//	});*/
//});
$(function(){
	var InitTable = function (url) {
    //先销毁表格
    $('#administratorTab_id').bootstrapTable("destroy");
    //加载表格
    $('#administratorTab_id').bootstrapTable({
        rowStyle: function (row, index) {//row 表示行数据，object,index为行索引，从0开始
            var style = "";
            if (row.SignInTime == '' || row.SignOutTime=='') {
                style = { css: { 'color': 'red' } };
            }
            return  style;
        },
        //searchAlign: 'left',
        //search: true,   //显示隐藏搜索框
        showHeader: true,     //是否显示列头
        //classes: 'table-no-bordered',
        showLoading: true,
        undefinedText: '',
        showFullscreen: true,
        toolbarAlign: 'left',
        paginationHAlign: 'right',
        silent: true,
        url: url,
        method: 'get',                      //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sortable: false,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        //queryParams: InitTable.queryParams,  //传递参数（*）
        sidePagination: "server",           //分页方式：client客户端分页，server服务端分页（*）
        pageNumber: 1,                       //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [2, 5, 10, 15],        //可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        showColumns: true,                  //是否显示所有的列
        showRefresh: true,                  //是否显示刷新按钮
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行
        //height: 680,                        //行高，如果没有设置height属性，表格自动根据记录条数觉得表格高度
        uniqueId: "ID",                     //每一行的唯一标识，一般为主键列
        showToggle: true,                    //是否显示详细视图和列表视图的切换按钮
        cardView: false,                    //是否显示详细视图
        detailView: false,                   //是否显示父子表
        showExport: true,
        //exportDataType: 'all',
        exportDataType: "selected",        //导出checkbox选中的行数
        paginationLoop: false,             //是否无限循环
        columns: [{
        	field : 'number',
			title : '行号',
			align: 'center',
			formatter : function(value, row, index) {
//							var page = $('#dictInfoTab_id').bootstrapTable("getOptions");
//							return page.pageSize * (page.pageNumber - 1) + index + 1;
				var pageSize=$('#dictInfoTab_id').bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
				console.log($('#dictInfoTab_id').bootstrapTable('getOptions'));
                var pageNumber=$('#dictInfoTab_id').bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                return Number(pageSize * (pageNumber - 1) + index + 1) ;//返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
			}
		},{
			checkbox: true
		},{
			//field: 'dictinfoId',
			visible: false //不显示
		}, {
			//field: 'dictName',
			title: '管理员名称',
			align: 'center',
		}, {
			//field: 'dictInfo',
			title: '手机号码',
			align: 'center',
		}, {
			//field: 'dictInfo',
			title: '密码',
			align: 'center',
		},{
			//field: 'state',
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
    return InitTable;
};
$('#addadministratorBut_id').click(function(){
	window.location.href = 'addAdministrator.html' ;
});
});