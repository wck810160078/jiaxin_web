$(function() {
	//先销毁表格
	$('#productTab_id').bootstrapTable('destroy');
	/*表格初始化*/
	tabelInitialization() ;
	/**
	 * 	更改stateSel_id（状态）更新表格搜索条件
	 */
	$('#stateSel_id').change(function(){
		$('#productTab_id').bootstrapTable('selectPage', 1);	//设置表格当前页为1
	});
	/**
	 * 	更改dictTypeSel_id（类别）更新表格搜索条件
	 */
	$('#dictTypeSel_id').change(function(){
		$('#productTab_id').bootstrapTable('selectPage', 1);
	});
	/**
	 * 点击productSeaBut_id（查找）更新表格搜索条件
	 */
	$('#productSeaBut_id').click(function(){
		$('#productTab_id').bootstrapTable('selectPage', 1);
	}) ;
	/**
	 * 点击productSeaDel_id（重置），清空查询条件
	 */
	$('#productSeaDel_id').click(function(){
		$('#productSea_id').val("");
		$("#stateSel_id").selectpicker('val','-1');
		$("#dictTypeSel_id").selectpicker('val','-1');
		$('#productTab_id').bootstrapTable('selectPage', 1);
	}) ;
	/**
     * 	点击productClose_id（批量停用）调用deleteStock方法批量删除库存信息
     */
    $('#productClose_id').click(function(){
    	deleteStockList("close") ;
    });
	/**
	 * 	点击productOpen_id（批量启用）调用deleteStock方法批量删除库存信息
	 */
	$('#productOpen_id').click(function(){
		deleteStockList("open") ;
	});
	/**
	 * 	隐藏零库存/显示全部
	 */
	$('#hide_zero').click(function(){
		var stockNow = $('#stockNowInput_id').val() ;
		if(stockNow == "0") {
			/*当stockNow=0,应该隐藏零库存*/
			$('#stockNowInput_id').val("-1") ;
			$('#hide_zero').text("隐藏零库存") ;
		}else if(stockNow == "-1") {
			$('#stockNowInput_id').val("0") ;
			$('#hide_zero').text("显示全部") ;
		}
		$('#productTab_id').bootstrapTable('selectPage', 1);
	}) ;
	/**
	 * 	导入
	 */
	$('#importStocks_id').click(function(){
		// importStocks("产品") ;
		$('#uploadFileDio_id').modal({
			backdrop: "static" //--设置为static后可以防止不小心点击其他区域是弹出框消失
		});
	});
	/**
	 * 	导出
	 */
	$('#exportStocks_id').click(function(){
		exportStocks("CP") ;
	});
	
});
/**
 * 	表格初始化
 * @param url 初始化请求接口
 */
function tabelInitialization() {
	$('#productTab_id').bootstrapTable({
		url : url+'/staff/getStockListByLabel',
        ajaxOptions: {
        	xhrFields: {        //跨域
        		withCredentials: true
        	},
        	crossDomain: true
        },
        contentType:'application/json',
        showHeader: true,     				//是否显示列头
        showLoading: true,
        undefinedText: "——", 				//当数据为 undefined 时显示的字符。
        showFullscreen: true,
        toolbarAlign: 'left',
        paginationHAlign: 'right',
        silent: true,
        singleSelect: false,				//复选框只能选择一条记录
        method: 'post',                     //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器 //设置工具栏的Id或者class 
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sidePagination: "server",			//分页方式：client客户端分页，server服务端分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 10,                       //每页的记录行数（*）
        pageList: [5,10,15],       			//可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行 //点击行即可选中单选/复选框 
        uniqueId: "stockId",              	//每一行的唯一标识，一般为主键列
        detailView: false,                  //是否显示父子表
        showExport: true,
        exportDataType: "selected",        	//导出checkbox选中的行数
        paginationLoop: false,             	//是否无限循环
        paginationPreText: "上一页",
        paginationNextText: "下一页",
        paginationFirstText : "首页",
        paginationLastText : "尾页",
        locale: "zh-CN", //中文支持
		responseHandler: function(res) {
			if(res.code == 10000) {
				return {
					"total": res.resp.total,//总页数
					"rows": res.resp.rows   //数据
				}
			}else {
				toastr.warning(res.message) ;
				// setTimeout(function() {
				// 	window.parent.location.href = "../../html/loginAndRegister.html" ;
				// },300);
			}
		},
		queryParams : function(params) {
			return {
				// 说明：传入后台的参数包括offset开始索引，limit步长，sort排序列，order：desc或者,以及所有列的键值对
				"size" : params.limit,
				"page" : params.offset,
				"paramObj" : {
					"label" 	: 	"CP",
					"state" 	:	$('#stateSel_id').val() == '-1' ? null : $('#stateSel_id').val(),
					"stockType" :	$('#dictTypeSel_id').val() == '-1' ? null : $('#dictTypeSel_id').val(),
					"stockSearchContent" :	$('#productSea_id').val() ,
					"stockNow" 	: 	$('#stockNowInput_id').val() == '-1' ? null : $('#stockNowInput_id').val()
				}
			};
		},
		// 请求服务器数据时，你可以通过重写参数的方式添加一些额外的参数，例如 toolbar 中的参数 如果
		// queryParamsType = 'limit' ,返回参数必须包含
		// limit, offset, search, sort, order 否则, 需要包含:
		// pageSize, pageNumber, searchText, sortName,
		// sortOrder.
		// 返回false将会终止请求
		formatLoadingMessage: function() {
			return "请稍等，正在加载中...";
		},
		icons: {
			refresh: "glyphicon-repeat",
			toggle: "glyphicon-list-alt"
		},
		columns: [
		{
			field : 'number',
			title : '行号',
			align: 'center',
			formatter : function(value, row, index) {
				var pageSize=$('#productTab_id').bootstrapTable('getOptions').pageSize;//通过表的#id 可以得到每页多少条
                var pageNumber=$('#productTab_id').bootstrapTable('getOptions').pageNumber;//通过表的#id 可以得到当前第几页
                return Number(pageSize * (pageNumber - 1) + index + 1) ;//返回每条的序号： 每页条数 * （当前页 - 1 ）+ 序号
			}
		},{
			checkbox: true
		},{
			field: 'stockId',
			align: 'center',
			visible: false //不显示
		},{
			field: 'stockName',
			title: '品名规格',
			align: 'center',
		},{
			field: 'stockType',
			title: '货品类别',
			align: 'center',
		}, {
			field: 'unit',
			title: '单位',
			align: 'center',
		}, {
			field: 'stockNow',
			title: '库存数量',
			align: 'center',
		}
		, {
			field: 'retailPrice',
			title: '零售价',
			align: 'center',
		}, {
			field: 'wholesalePrice',
			title: '批发价',
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
			formatter: method 
		}]
	});
}
/**
 * 自定义操作列
 * @param {Object} value
 * @param {Object} row
 * @param {Object} index
 */
function method(value, row, index) {
	var open = "<input type='button' id=" + row["stockId"] + " class='changeStockState_class' onclick='changeStockState( " + JSON.stringify(row) + ")' value='开启'>";
	var close = "<input type='button' id=" + row["stockId"] + " class='changeStockState_class' onclick='changeStockState(" + JSON.stringify(row) + ")' value='关闭'>"
	var edit = "<input type='button' id='edit"+row["stockId"]+"' class='editStock_class' onclick='editStock("+row['stockId']+")' value='编辑'>" ;
	return row["state"] == "open" ? close+"&nbsp;&nbsp;&nbsp;&nbsp;"+edit : open+"&nbsp;&nbsp;&nbsp;&nbsp;"+edit;
}
/**
 * 	修改单条库存信息状态
 * @param row
 */
function changeStockState(row) {
	var ids= row.stockId ;
	var state = row.state ;
	if(state == "open") {
		state = "close" ;
	}else {
		state = "open" ;
	}
	deleteStock(ids,state) ;
}
/**
 * 批量删除库存信息
 * @param ids
 */
function deleteStock(ids,state) {
	$.ajax({
		type: "get",
		url: url+'/staff/changeStockState',
		async: true,
		data: {
			"stockIds": ids,
			"state" :state
		},
		crossDomain:true, //设置跨域为true
		xhrFields: {
		     withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
		},
		success: function(result) {
			if(result.code == 10000) {
				toastr.success("修改成功！") ;
				$("#productTab_id").bootstrapTable('refresh'); //刷新，但页码依然为当前的页码，比如page=5依然为5 
				return ;
			}
			if(result.code == 32000) {
				toastr.warning(result.message) ;
				// setTimeout(function() {
				// 	$("#loginDialog_id").modal({
				// 		backdrop: "static" 
				// 	});
				// },300);
				return ;
			}
			toastr.warning(result.message) ;
			$("#productTab_id").bootstrapTable('refresh'); //刷新，但页码依然为当前的页码，比如page=5依然为5 
		},
		error: function(result) {
			// toastr.error(data.info) ;
		}
	});
}
/**
 * 	获取批量修改库存信息的状态
 */
function deleteStockList(state) {
	/*获取所有被选中的记录*/
	var rows= $('#productTab_id').bootstrapTable('getSelections') ;
	if(rows.length == 0) {
		toastr.warning("请选择要停用的数据") ;
		return ;
	}
	var ids= "" ;
	for(var i = 0 ; i < rows.length ; i++) {
		ids += rows[i]['stockId']+",";
	}
	ids = ids.substring(0,ids.length - 1) ;	//去掉最后的字符
	deleteStock(ids,state) ;
}
/**
 * 根据标签导出库存信息
 * @param {Object} label	标签
 */
function exportStocks(label) {
	window.location.href = url+'/staff/exportStocks?label=' +label ; 
}
/**
 * 导入库存信息
 * @param {Object} label	标签
 */
function importStocks(label) {}