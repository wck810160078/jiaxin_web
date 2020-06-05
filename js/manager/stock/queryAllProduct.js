// var url = url ;
$(function() {
	//先销毁表格
    $('#productTab_id').bootstrapTable('destroy');
	/*表格初始化*/
	tabelInitialization() ;
	/*toastr弹出框插件初始化*/
	// toastrInitialization() ;
	/**
	 * 上传图片fileinput初始化
	 */
	// imgFileinputInitialization() ;
	/**
	 * 上传文件fileinput初始化
	 */
	// excelFileinputInitialization() ;
	/**
	 * 	表单验证初始化
	 */
	// formValidator();
	/**
	 * 	点击addProductBut_id时，显示productDialog_id Dialog
	 */
	$("#addProductBut_id").click(function() {
		selectDictInfo() ;
		$('#dialogLabel_id').text("新增产品信息");
		$('#productDialog_id').modal({
			backdrop: "static" //--设置为static后可以防止不小心点击其他区域是弹出框消失
		});
	});
	/*
	函数作用：点击id为addProductSubmit_id的button后调用insertImg添加库存信息
	参数说明：无
	*/
	$("#addProductSubmit_id").click(function(){
		/*表单验证*/
		var bootstrapValidator = $("#addProductForm_id").data('bootstrapValidator');
	   	bootstrapValidator.validate();
	   	if(!bootstrapValidator.isValid()){
	    	return ;
		}
		var form = document.querySelector("#addProductForm_id") ;
		let formData = new FormData(form);
		formData.append("label","产品") ;
		$.ajax({
			type:"post",	
			url:"http://127.0.0.1:8080/insertStockImg",
			async:false,
			data:formData,
			contentType:false,
			processData:false,
			success:function(result) {
				$('#stockId').val(result.response);
				$('#dialogLabel_id').text("");
				$('#productDialog_id').modal('hide'); //关闭对话框
				$('#productTab_id').bootstrapTable('refresh');
				toastr.success(result.info);
			},
			error:function(result) {
				toastr.error(result.info);
			}
		});
	});
 	//Modal验证销毁重构
    $('#productDialog_id').on('hidden.bs.modal', function() {
        $("#addProductForm_id").data('bootstrapValidator').destroy();
        $('#addProductForm_id').data('bootstrapValidator', null);
        $('#addProductForm_id')[0].reset();
        formValidator();
    });
    //Modal验证销毁重构
    $('#uploadFileDio_id').on('hidden.bs.modal', function() {
        $('#importFile')[0].reset();
        formValidator();
    });
    /**
     * 	点击productDel_id调用deleteStock方法批量删除库存信息
     */
    $('#productDel_id').click(function(){
    	deleteStockList() ;
    });
    /**
     * 	更改stateSel_id调更新表格搜索条件
     */
    $('#stateSel_id').change(function(){
		$('#productTab_id').bootstrapTable('selectPage', 1);	//设置表格当前页为1
    });
    /**
     * 	更改dictTypeSel_id调更新表格搜索条件
     */
    $('#dictTypeSel_id').change(function(){
		$('#productTab_id').bootstrapTable('selectPage', 1);
    });
    /**
     * 点击productSeaBut_id调更新表格搜索条件
     */
    $('#productSeaBut_id').click(function(){
    	$('#productTab_id').bootstrapTable('selectPage', 1);
    }) ;
    /**
     * 点击productSeaDel_id 按钮，清空查询条件
     */
    $('#productSeaDel_id').click(function(){
		$('#productSea_id').val("");
		$("#stateSel_id").selectpicker('val','-1');
		$("#dictTypeSel_id").selectpicker('val','-1');
		$('#productTab_id').bootstrapTable('selectPage', 1);
    }) ;
    /**
     * 	隐藏零库存/显示全部
     */
    $('#hide_zero').click(function(){
    	var stockNow = $('#stockNow_id').val() ;
    	if(stockNow == "0") {
    		/*当stockNow=0,应该隐藏零库存*/
    		$('#stockNow_id').val("-1") ;
    		$('#hide_zero').text("隐藏零库存") ;
    	}else if(stockNow == "-1") {
    		$('#stockNow_id').val("0") ;
    		$('#hide_zero').text("显示全部") ;
    	}
    	$('#productTab_id').bootstrapTable('selectPage', 1);
    }) ;
    /**
     * 	导出
     */
    $('#outcome_id').click(function(){
		window.location.href = "http://127.0.0.1:8080/downloadStockInfo?label="+"产品" ;
    });
    $('#income_id').click(function(){
    	$('#uploadFileDio_id').modal({
			backdrop: "static" //--设置为static后可以防止不小心点击其他区域是弹出框消失
		});
    }) ;
    $('#upoadFileBut_id').click(function(){
    	uploadFile() ;
    });
}) ;
/**
 * 	导入
 */
function uploadFile() {
	var formData = new FormData();
		formData.append("file", $("#uploadFile_id")[0].files[0]);
		formData.append("label", "产品");//这个地方可以传递多个参数
		$.ajax({
			url : 'http://127.0.0.1:8080/uploadStock',
			type : 'POST',
			async : false,
			data : formData,
	        cache: false,//上传文件无需缓存
			// 告诉jQuery不要去处理发送的数据
			processData : false,
			// 告诉jQuery不要去设置Content-Type请求头
			contentType : false,
			success : function(result) {
				$('#uploadFileDio_id').modal('hide'); //关闭对话框
				toastr.success(result.info);
				$('#productTab_id').bootstrapTable('refresh');
			},
			error : function(result) {
				console.log(result.info);//可以在控制台查看打印的data值
			}
		});
}
/**
 * 	初始化下拉框
 */
function selectDictInfo() {
	$.ajax({
		type:"post" ,
		url :"http://127.0.0.1:8080/selectDictInfoByCode" ,
		async:true,
		dataType:"json",
		data:{
			"dictCode" : "003,002" ,
		},
		success : function(result) {
			if(result.stateCode != "200") {
				toastr.error(result.info);
				return ;
			}
			showData(result.response) ;
		},
		error : function(result) {
			toastr.error(result.info);
		}
	});
}
/*
函数名称：showData
函数作用：拼接select，展示数据
参数说明：result：通过ajax调用selectDictInfo接收到的所有数据字典类型
*/
function showData(result) {
	var unitStr = "" ;
	var stockTypeStr = "" ;
	$(result).each(function(index,value){
		if(value.dictCode == "003") {
			unitStr = "<option value='"+value.dictInfo+"'>"+value.dictInfo+"</option>" ;
			$('#unit_id').append(unitStr) ;
		}else if(value.dictCode == "002") {
			stockTypeStr = "<option value='"+value.dictInfo+"'>"+value.dictInfo+"</option>" ;
			$('#stockType_id').append(stockTypeStr);
		}
	});
}
/**
 * 	修改单条库存信息状态
 * @param stockId
 */
function changeStockState(stockId) {
	deleteStock(stockId) ;
}
/**
 * 修改库存信息
 * @param stockId
 */
function editStock(stockId) {
	/*var formData = new FormData();
	formData.append("stockId",stockId);*/
	
	$.ajax({
		type:"post",
		url:"http://127.0.0.1:8080/selectStockByPrimaryKey",
		async:true,
		data: "stockId="+stockId,
		success : function(data) {
			$('#editDialog_id').modal({
				backdrop: "static" //--设置为static后可以防止不小心点击其他区域是弹出框消失
			});
			console.log(data) ;
			$('#editStockName_id').val(data.response.stockName) ;
//			if(data.response.imgList.length > 0) {
//				var img = "" ;
//				for(var i=0;i<data.response.imgList.length;i++) {
//					img += "<img src='"+data.response.imgList[i].imgSrc+"' >" ;
//				}
//				$('#stockImg_id').append(img) ;
//			}
			
			 
		}
	});
}
function method(value, row, index) {
	var open = "<input type='button' id=" + row["stockId"] + " class='changeStockState_class' onclick='changeStockState(" + row['stockId'] + ")' value='开启'>";
	var close = "<input type='button' id=" + row["stockId"] + " class='changeStockState_class' onclick='changeStockState(" + row['stockId'] + ")' value='关闭'>"
	var edit = "<input type='button' id='edit"+row["stockId"]+"' class='editStock_class' onclick='editStock("+row['stockId']+")' value='编辑'>" ;
	return row["state"] == "open" ? close+"&nbsp;&nbsp;&nbsp;&nbsp;"+edit : open+"&nbsp;&nbsp;&nbsp;&nbsp;"+edit;
}
/**
 * 	获取批量逻辑删除库存信息
 */
function deleteStockList() {
	/*获取所有被选中的记录*/
	var rows= $('#productTab_id').bootstrapTable('getSelections') ;
	if(rows.length == 0) {
		toastr.warning("请选择要删除的数据") ;
		return ;
	}
	var ids= "" ;
	for(var i = 0 ; i < rows.length ; i++) {
		ids += rows[i]['stockId']+",";
	}
	ids = ids.substring(0,ids.length - 1) ;	//去掉最后的字符
	deleteStock(ids) ;
}
/**
 * 批量删除库存信息
 * @param ids
 */
function deleteStock(ids) {
	$.ajax({
		type: "post",
		url: "http://127.0.0.1:8080/changeStockState",
		async: true,
		data: {
			"stockId": ids
		},
		success: function(data) {
			toastr.success(data.info) ;
			$("#productTab_id").bootstrapTable('refresh'); //刷新，但页码依然为当前的页码，比如page=5依然为5 
		},
		error: function(data) {
			toastr.error(data.info) ;
		}
	});
}
 //form验证规则
function formValidator(){
	/*初始化表单验证插件*/
    $('#addProductForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		stockName: {
    			message: '品名规格验证失败',
                validators: {
                    notEmpty: {
                        message: '品名规格不能为空'
                    },stringLength: {
                         min: 1,
                         max: 30,
                         message: '用户名长度必须在1到30之间'
                    },
                    threshold :  5 , //设置5字符以上开始请求服务器
                    //有待验证，备注以备下次使用。
                    //bootstrap的remote验证器需要的返回结果一定是json格式的数据 :
                    //{"valid":false} //表示不合法，验证不通过
                    //{"valid":true} //表示合法，验证通过
                    remote: {//发起Ajax请求。
                        url: 'http://127.0.0.1:8080/validatorStockByName',//验证地址
                        data:{stockName:$('input[name="stockName"]').val() },
                        message: '产品信息已存在！',//提示消息
                        delay :  1000,//设置1秒发起名字验证
                        type: 'POST' //请求方式
                    }
                }
            }
        }
    });
}
/**
 * 	表格初始化
 * @param url 初始化请求接口
 */
function tabelInitialization() {
	$('#productTab_id').bootstrapTable({
		url : url+'/staff/getStockListByLabel',
		// url: url,
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
        singleSelect: false,					//复选框只能选择一条记录
        method: 'post',                     //请求方式（*）
        toolbar: '#toolbar',                //工具按钮用哪个容器 //设置工具栏的Id或者class 
        striped: true,                      //是否显示行间隔色
        cache: false,                       //是否使用缓存，默认为true，所以一般情况下需要设置一下这个属性（*）
        pagination: true,                   //是否显示分页（*）
        sidePagination: "server",			//分页方式：client客户端分页，server服务端分页（*）
        sortable: true,                     //是否启用排序
        sortOrder: "asc",                   //排序方式
        pageNumber: 1,                      //初始化加载第一页，默认第一页
        pageSize: 5,                       	//每页的记录行数（*）
        pageList: [5,10,15],       			//可供选择的每页的行数（*）
        search: false,                      //是否显示表格搜索，此搜索是客户端搜索，不会进服务端，所以，个人感觉意义不大
        strictSearch: true,
        minimumCountColumns: 2,             //最少允许的列数
        clickToSelect: true,                //是否启用点击选中行 //点击行即可选中单选/复选框 
        uniqueId: "stockId",              //每一行的唯一标识，一般为主键列
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
				"limit" : params.limit,
				"offset" : params.offset,
				"paramObj" : {
					"label" 	: 	"CP",
					"state" 	:	$('#stateSel_id').val() == '-1' ? null : $('#stateSel_id').val(),
					"stockType" :	$('#dictTypeSel_id').val() == '-1' ? null : $('#dictTypeSel_id').val(),
					"stockName" :	$('#productSea_id').val() ,
					"stockNow" 	: 	$('#stockNow_input_id').val()
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
//		, {
//			field: 'purchasePrice',
//			title: '进货价',
//			align: 'center',
//		}
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
 * 	fileinput上传插件初始化（图片上传）
 */
function imgFileinputInitialization() {
	$('#uploadImg_id').fileinput({
		language: 'zh', //设置语言
		uploadUrl: "http://127.0.0.1:8080/insertStockImg", //上传的地址
		allowedFileExtensions: ['jpg', 'gif', 'png'], //接收的文件后缀
		uploadAsync: true, //默认异步上传
		showUpload: false, //是否显示上传按钮
		showRemove: true, //显示移除按钮
		showPreview: true, //是否显示预览
		showCaption: false, //是否显示标题
		browseLabel: "选择产品图片",
//		uploadClass: "btn btn-info",
//		uploadLabel: "上传",
		removeClass: "btn btn-danger",
		autoReplace: true,
		removeLabel: "移除",
		browseClass: "btn btn-primary", //按钮样式
		dropZoneEnabled: false, //是否显示拖拽区域
		//minImageWidth: 50, //图片的最小宽度
		//minImageHeight: 50,//图片的最小高度
		//maxImageWidth: 1000,//图片的最大宽度
		//maxImageHeight: 1000,//图片的最大高度
		maxFileSize: 1024*8,//单位为kb，如果为0表示不限制文件大小
		//minFileCount: 0,
		maxFileCount: 8, //表示允许同时上传的最大文件个数
		enctype: 'multipart/form-data',
		validateInitialCount: true,
		previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
		msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
		layoutTemplates: {
//        	actionDelete:'', //去除上传预览的缩略图中的删除图标
			actionUpload: '', //去除上传预览缩略图中的上传图片；
//	        actionZoom:'',   //去除上传预览缩略图中的查看详情预览的缩略图标。
		},
		uploadExtraData: function () {
			var data = {
                "stockId" : $("#stockId").val(),
            };
            return data;
    	},
	}).on('filepreupload', function(event, data, previewId, index) { //上传中
		var form = data.form,
		files = data.files,
		extra = data.extra,
		response = data.response,
		reader = data.reader;
		console.log('文件正在上传');
	}).on("fileuploaded", function(event, data, previewId, index) { //一个文件上传成功
		console.log('文件上传成功！');
		console.log(data) ;
	}).on('fileerror', function(event, data, msg) { //一个文件上传失败
		console.log('文件上传失败！' + data.id);
	});
}
function excelFileinputInitialization() {
	$('#uploadFile_id').fileinput({
		language: 'zh', //设置语言
		//uploadUrl: "http://127.0.0.1:8080/uploadStock", //上传的地址
		allowedFileExtensions: ['xls', 'xlsx'], //接收的文件后缀
		uploadAsync: true, //默认异步上传
		showUpload: false, //是否显示上传按钮
		showRemove: true, //显示移除按钮
		showPreview: false, //是否显示预览
		showCaption: false, //是否显示标题
		browseLabel: "选择导入文件",
		removeClass: "btn btn-danger",
		autoReplace: true,
		removeLabel: "移除",
		browseClass: "btn btn-primary", //按钮样式
		dropZoneEnabled: false, //是否显示拖拽区域
		enctype: 'multipart/form-data',
		validateInitialCount: true,
		previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
		msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！"
	}).on('filepreupload', function(event, data, previewId, index) { //上传中
		var form = data.form,
		files = data.files,
		extra = data.extra,
		response = data.response,
		reader = data.reader;
		console.log('文件正在上传');
	}).on("fileuploaded", function(event, data, previewId, index) { //一个文件上传成功
		console.log('文件上传成功！');
		console.log(data) ;
	}).on('fileerror', function(event, data, msg) { //一个文件上传失败
		console.log('文件上传失败！' + data.id);
	});
}