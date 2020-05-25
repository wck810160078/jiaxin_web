// 路径

var url = "http://192.168.3.23:8080";
// var url = "http://192.168.43.193:8080";
// var url = "http://localhost:8080";
$(function() {
});
/*
函数名称：showData
函数作用：拼接select，展示数据
参数说明：result：通过ajax调用getModuleList接收到的所有类别
*/
function showSelectData(id,result,goodsTypeId) {
	// console.log(result);
	var str = "" ;
	$(id).html("") ;
	$(result).each(function(index,value){
		if(goodsTypeId == value.goodsTypeId) {
			str = "<option value='"+value.goodsTypeId+"' selected='selected'>"+value.moduleName+"</option>" ;
		}else {
			str = "<option value='"+value.goodsTypeId+"'>"+value.moduleName+"</option>" ;
		}
		$(id).append(str) ;
		//使用refresh方法更新UI以匹配新状态。
		$(id).selectpicker('refresh');
		//render方法强制重新渲染引导程序 - 选择ui。
		$(id).selectpicker('render');
	});
}
/**
 * 初始化物品分类下拉框
 * @param {Object} id	下拉框id
 * @param {Object} goodsTypeId
 */
function selectInitialization(id,goodsTypeId) {
	$.ajax({
		type:"post" ,
		url : url+'/getgoodsTypeList',
		async:true,
		data:"{}",
		dataType:"json",
		contentType:'application/json',
		crossDomain:true, //设置跨域为true
		xhrFields: {
		     withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
		},
		success : function(result) {
			// console.log(result) ;
			if(result.code != 10000) {
				toastr.error(result.message);
				return ;
			}
			if(result.code == 32000) {
				toastr.warning(result.message);
				$('#loginDialog_id').modal({
				//--设置为static后可以防止不小心点击其他区域是弹出框消失
					backdrop: "static"	,
				});
				return ;
			}
			showSelectData(id,result.resp,goodsTypeId) ;
		},
		error : function(result) {
			// toastr.error(result.info);
		}
	});
}
/**
 * 退出登录
 */
function logOut() {
	$.ajax({
		url : url+'/logout',
		type : 'POST',
		async : false,
		xhrFields: {
			withCredentials: true
		},
		success:function(result) {
			window.location.href = "../loginAndRegister.html" ;
		},
		error:function(result) {
		}
	});
}
/**
 * 验证是否已登录
 */
function userNameInitialization() {
	var userInfo = "" ;
	// var userId = 0 ;
	$.ajax({
		url : url+'/getUser',
		type : 'get',
		async : false,
		xhrFields: {
			withCredentials: true
		},
		success:function(result) {
			// console.log(result) ;
			if(result.code == 10000) {
				if(result.resp == null || result.resp == "") {
					$("#userName").text("游客");
					$("#logOut_id").attr("style","display:none;");
					$("#myInfo_id").attr("style","display:none;");
					$("#login_id").attr("style","display:inline;");
					$("#register_id").attr("style","display:inline;");
				}else {
					userInfo = result.resp ;
					$("#userName").text("亲爱的"+result.resp.userName);
					$("#logOut_id").attr("style","display:inline;");
					$("#myInfo_id").attr("style","display:inline-block;");
					$("#login_id").attr("style","display:none;");
					$("#register_id").attr("style","display:none;");
				}
			}
		},
		error:function(result) {
		}
	});
	// console.log("用户信息："+userInfo.userName);
	return userInfo ;
}
//导入js文件
function addScript(url){
	document.write("<link rel='stylesheet' href='../css/bootstrap/validator/bootstrapValidator.css' />");
	document.write("<script type='text/javascript' src='jQuery/bootstrap/validator/bootstrapValidator.js' ></script>");
	document.write("<script type='text/javascript' src='jQuery/bootstrap/validator/zh_CN.js' ></script>");
}
function clickOpenModal(clickId,modalId) {
	$(clickId).click(function() {
		$(modalId).modal({
			backdrop: "static" 
		});
	}) ;
}
/**
 * 表单数据转json数据
 * @param {Object} formId
 */
function formDataToJsonDate(formId) {
	var form = document.querySelector(formId) ;
	let formData = new FormData(form);
	var jsonData = {} ;
	formData.forEach((value,key)=>{
		if(key=='getLostTime'){
			jsonData[key]=new Date(value);
		}else{
			jsonData[key]=value;
		}
	});
	return jsonData ;
}
/**
 * 	toastr插件初始化
 */
function toastrInitialization() {
	/*将这个属性值设置为不同的值就能让提示信息显示在不同的位置，
	如toast-bottom-right表示下右、toast-bottom-center表示下中、
	toast-top-center表示上中等，toast-top-full-width表示顶端中间(宽度铺满)
	*/
	 toastr.options = {
        closeButton: false,		//是否显示关闭按钮
        debug: false,			//是否使用debug模式
        progressBar: false,
        positionClass: "toast-top-right",	//弹出窗的位置
        onclick: null,
        showDuration: "300",	//显示的动画时间
        hideDuration: "1000",	//消失的动画时间
        timeOut: "1000",		//展现时间
        extendedTimeOut: "1000",	//加长展示时间
        showEasing: "swing",		//显示时的动画缓冲方式
        hideEasing: "linear",		//消失时的动画缓冲方式
        showMethod: "fadeIn",		//显示时的动画方式
        hideMethod: "fadeOut"		//消失时的动画方式
    };
}
/**
 * 	发布留言form验证规则
 */
function releaseGuestBookFormValidator(){
	/*初始化表单验证插件*/
    $('#releaseGuestBookForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		guestbookContent: {
    			message: '留言内容验证失败',
                validators: {
                    notEmpty: {
                        message: '留言内容不能为空'
                    },
					stringLength: {
                         min: 1,
                         max: 240,
                         message: '留言内容长度必须在1到240之间'
                    },
                }
            },
        }
    });
}
/**
 * 发布留言Modal验证销毁重构
 */
function releaseGuestBookDialogHidden() {
	$('#releaseGuestBookDialog_id').on('hidden.bs.modal', function() {
		$("#text-count2").text(0);
		$("#releaseGuestBookForm_id").data('bootstrapValidator').destroy();
		$('#releaseGuestBookForm_id').data('bootstrapValidator', null);
		$('#releaseGuestBookForm_id')[0].reset();
		releaseGuestBookFormValidator();
	});
}
/**
 * 	发布失物招领form验证规则
 */
function releaseLostPropertyInfoFormValidator(){
	/*初始化表单验证插件*/
    $('#releaseLostPropertyInfoForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		releaseTitle: {
    			message: '物品名称验证失败',
                validators: {
                    notEmpty: {
                        message: '物品名称不能为空'
                    },
					stringLength: {
                         min: 1,
                         max: 20,
                         message: '用户名长度必须在1到20之间'
                    },
                }
            },
			detailedAddress: {
				message: '拾取地点验证失败',
			    validators: {
			        notEmpty: {
			            message: '拾取地点不能为空'
			        },
					stringLength: {
			             min: 1,
			             max: 30,
			             message: '拾取地点长度必须在1到30之间'
			        },
			    }
			},
			releaseContent: {
				message: '详细描述验证失败',
			    validators: {
			        notEmpty: {
			            message: '详细描述不能为空'
			        },
					stringLength: {
			             min: 1,
			             max: 240,
			             message: '详细描述长度必须在1到240之间'
			        },
			    }
			},
			releaseUser: {
				message: '拾取人验证失败',
			    validators: {
			        notEmpty: {
			            message: '拾取人不能为空'
			        },
					stringLength: {
			             min: 1,
			             max: 10,
			             message: '拾取人信息长度必须在1到10之间'
			        },
			    }
			},
			releasePhone: {
				message: '联系方式验证失败',
			    validators: {
			        notEmpty: {
			            message: '联系方式不能为空,且只能为数字'
			        },
					stringLength: {
			             min: 1,
			             max: 30,
			             message: '联系方式长度必须在1到30之间'
			        },
			    }
			},
			getLostTime: {
				message: '拾取时间验证失败',
			    validators: {
			        notEmpty: {
			            message: '拾取时间不能为空'
			        },
			    }
			},
        }
    });
}
/**
 * 发布失物招领Modal验证销毁重构
 */
function releaseLostPropertyInfoDialogHidden() {
	$('#releaseLostPropertyInfoDialog_id').on('hidden.bs.modal', function() {
	    $("#releaseLostPropertyInfoForm_id").data('bootstrapValidator').destroy();
	    $('#releaseLostPropertyInfoForm_id').data('bootstrapValidator', null);
	    $('#releaseLostPropertyInfoForm_id')[0].reset();
		$("#text-count2").text(0);
	    $("#releaseLostPropertyType_id").selectpicker('val','0');
		releaseLostPropertyInfoFormValidator();
	});
}
/**
 * 	登录form验证规则
 */
function loginFormValidator(){
	/*初始化表单验证插件*/
    $('#loginForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		username: {
    			message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },stringLength: {
                         min: 3,
                         max: 10,
                         message: '用户名长度必须在1到10之间'
                    },
                    threshold :  2 , //设置5字符以上开始请求服务器
                    //有待验证，备注以备下次使用。
                    //bootstrap的remote验证器需要的返回结果一定是json格式的数据 :
                    //{"valid":false} //表示不合法，验证不通过
                    //{"valid":true} //表示合法，验证通过
                    remote: {//发起Ajax请求。
                        url: url+'/validatorUserName',//验证地址
						//need:是否需要username为空，需要传true,不需要传false
                        data:{username:$('input[name="userName"]').val(),need:false},
                        message: '用户名不存在！',//提示消息
                        delay :  300,//设置0.3秒发起名字验证
                        type: 'get' //请求方式
                    }
                }
            },
			password: {
				message: '密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '密码不能为空'
			        },
					stringLength: {
			             min: 3,
			             max: 12,
			             message: '密码长度必须在3到12之间'
			        },
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
        }
    });
}
/**
 * 登录Modal验证销毁重构
 */
function loginDialogHidden() {
	$('#loginDialog_id').on('hidden.bs.modal', function() {
	    $("#loginForm_id").data('bootstrapValidator').destroy();
	    $('#loginForm_id').data('bootstrapValidator', null);
	    $('#loginForm_id')[0].reset();
	    loginFormValidator();
	});
}
function userLogin() {
	/*表单验证*/
	var bootstrapValidator = $("#loginForm_id").data('bootstrapValidator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isValid()){
		return ;
	}
	$.ajax({
		url : url+'/login',
		type : 'POST',
		async : false,
		xhrFields: {
			withCredentials: true
		},
		data:$('#loginForm_id').serialize(),//jq提供的获取form表单数据的快捷方式，通过form内标签的id属性
		success:function(result) {
			if(result.code != 10000) {
				toastr.warning(result.message) ;
				return ;
			}
			if(result.resp == 2) {
				window.location.href="../html/user/userMain.html" ;
			}else {
				window.location.href = "../html/manager/a.html" ;
			}
		},
		error:function(result) {
			// console.log(result.message);//可以在控制台查看打印的data值
		}
	});
}
/**
 * 	我的信息form验证规则
 */
function myInfoFormValidator(){
	/*初始化表单验证插件*/
    $('#myInfoForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
			name: {
				message: '真实姓名验证失败',
			    validators: {
			        notEmpty: {
			            message: '真实姓名不能为空'
			        },
					stringLength: {
			             min: 1,
			             max: 10,
			             message: '真实姓名长度必须在1到10之间'
			        },
			    }
			},
			email: {
				message: '邮箱验证失败',
			    validators: {
			        notEmpty: {
			            message: '邮箱不能为空'
			        },
					regexp: {
						regexp: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
						message: '邮箱格式不正确'
					}
			    }
			},
			phoneNumber: {
				message: '手机号码验证失败',
			    validators: {
			        notEmpty: {
			            message: '手机号码不能为空'
			        },
					regexp: {
						regexp: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
						message: '手机号码格式不正确'
					},
			    }
			},
        }
    });
}
/**
 * 我的信息Modal验证销毁重构
 */
function myInfoDialogHidden() {
	$('#myInfoDialog_id').on('hidden.bs.modal', function() {
		$("#myInfoForm_id").data('bootstrapValidator').destroy();
		$('#myInfoForm_id').data('bootstrapValidator', null);
		$('#myInfoForm_id')[0].reset();
		myInfoFormValidator();
	});
}
/**
 * 	注册form验证规则
 */
function registerFormValidator(){
	/*初始化表单验证插件*/
    $('#registerForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		userName: {
    			message: '用户名验证失败',
                validators: {
                    notEmpty: {
                        message: '用户名不能为空'
                    },stringLength: {
                         min: 3,
                         max: 10,
                         message: '用户名长度必须在3到10之间'
                    },
                    threshold :  2 , //设置5字符以上开始请求服务器
                    //有待验证，备注以备下次使用。
                    //bootstrap的remote验证器需要的返回结果一定是json格式的数据 :
                    //{"valid":false} //表示不合法，验证不通过
                    //{"valid":true} //表示合法，验证通过
                    remote: {//发起Ajax请求。
                        url: url+'/validatorUserName',//验证地址
						//need:是否需要username为空，需要传true,不需要传false
                        data:{username:$('input[name="userName"]').val(),need:true},
                        message: '用户名已存在！',//提示消息
                        delay :  500,//设置1秒发起名字验证
                        type: 'get' //请求方式
                    }
                }
            },
			name: {
				message: '真实姓名验证失败',
			    validators: {
			        notEmpty: {
			            message: '真实姓名不能为空'
			        },
					stringLength: {
			             min: 1,
			             max: 10,
			             message: '真实姓名长度必须在1到10之间'
			        },
			    }
			},
			passw: {
				message: '密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '密码不能为空'
			        },
					stringLength: {
			             min: 3,
			             max: 12,
			             message: '密码长度必须在3到12之间'
			        },
					identical: {
						field: 'password',
						message: '两次输入的密码不一致'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
			password: {
				message: '确认密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '确认密码不能为空'
			        },
					stringLength: {
					     min: 3,
					     max: 12,
					     message: '密码长度必须在3到12之间'
					},
					identical: {
						field: 'passw',
						message: '两次输入的密码不一致'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
			email: {
				message: '邮箱验证失败',
			    validators: {
			        notEmpty: {
			            message: '邮箱不能为空'
			        },
					regexp: {
						regexp: /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/,
						message: '邮箱格式不正确'
					}
			    }
			},
			phoneNumber: {
				message: '手机号码验证失败',
			    validators: {
			        notEmpty: {
			            message: '手机号码不能为空'
			        },
					regexp: {
						regexp: /^(13[0-9]|14[5|7]|15[0|1|2|3|4|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
						message: '手机号码格式不正确'
					}
			    }
			},
        }
    });
}
/**
 * 注册Modal验证销毁重构
 */
function registerDialogHidden() {
	$('#registerDialog_id').on('hidden.bs.modal', function() {
	    $("#registerForm_id").data('bootstrapValidator').destroy();
	    $('#registerForm_id').data('bootstrapValidator', null);
	    $('#registerForm_id')[0].reset();
	    registerFormValidator();
	});
}
/**
 * 用户注册
 */
function userRegister() {
	var bootstrapValidator = $("#registerForm_id").data('bootstrapValidator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isValid()){
		return ;
	}
	// saveFormValidator("#registerForm_id") ;
	var userName = $("#userName_id").val() ;
	var jsonData = formDataToJsonDate("#registerForm_id") ;
	$.ajax({
		type:"post",	
		url:url+'/register',
		async:false,
		processData:false,
		crossDomain:true, //设置跨域为true
		xhrFields: {
		     withCredentials: true //默认情况下，标准的跨域请求是不会发送cookie的
		},
		data:JSON.stringify(jsonData),
		contentType:'application/json',
		success:function(result) {
			if(result.code == 10000) {
				toastr.success("注册成功!请登录！");
				$("#registerDialog_id").modal('hide');
				$("#loginUserName_id").val(userName) ;
				setTimeout(function() {
					$("#loginDialog_id").modal(function() {
						backdrop: "static" //--设置为static后可以防止不小心点击其他区域是弹出框消失
					});
				},200);
				return ;
			}
				toastr.warning(result.message) ;
		},
		error:function(result) {
			// toastr.error(result.message);
		}
	});
}
/**
 * 	修改密码form验证规则
 */
function changePasswordFormValidator(){
	/*初始化表单验证插件*/
    $('#changePasswordForm_id').bootstrapValidator({
    	message: 'This value is not valid',
    	//提供输入验证图标提示
    	feedbackIcons: {
    		valid: 'glyphicon glyphicon-ok',
    		invalid: 'glyphicon glyphicon-remove',
    		validating: 'glyphicon glyphicon-refresh'
    	},
    	fields: {
    		code: {
    			message: '验证码验证失败',
                validators: {
                    notEmpty: {
                        message: '验证码不能为空，且只能为数字'
                    },stringLength: {
                         min: 1,
                         max: 4,
                         message: '验证码长度必须在1到4之间'
                    },
                }
            },
			oldPassword: {
				message: '旧密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '旧密码不能为空'
			        },
					stringLength: {
			             min: 3,
			             max: 12,
			             message: '密码长度必须在3到12之间'
			        },
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
			newPassword: {
				message: '新密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '新密码不能为空'
			        },
					stringLength: {
			             min: 3,
			             max: 12,
			             message: '密码长度必须在3到12之间'
			        },
					identical: {
						field: 'newPasswordConfirm',
						message: '两次输入的密码不一致'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
			newPasswordConfirm: {
				message: '确认密码验证失败',
			    validators: {
			        notEmpty: {
			            message: '确认密码不能为空'
			        },
					stringLength: {
					     min: 3,
					     max: 12,
					     message: '密码长度必须在3到12之间'
					},
					identical: {
						field: 'newPassword',
						message: '两次输入的密码不一致'
					},
					regexp: {
						regexp: /^[a-zA-Z0-9_]+$/,
						message: '密码只能包含大写、小写、数字和下划线'
					}
			    }
			},
        }
    });
}
/**
 * 修改密码Modal验证销毁重构
 */
function changePasswordDialogHidden() {
	$('#changePasswordDialog_id').on('hidden.bs.modal', function() {
	    $("#changePasswordForm_id").data('bootstrapValidator').destroy();
	    $('#changePasswordForm_id').data('bootstrapValidator', null);
	    $('#changePasswordForm_id')[0].reset();
	    changePasswordFormValidator();
	});
}
function youqinglianjie() {
	//友情链接--丢哪了
	$("#diunale_id").click(function() {
		window.open("http://www.diunal.com/") ;
	});
	//友情链接--失物招领网
	$("#shiwuzhaolingwang_id").click(function() {
		window.open("http://www.swzl.com/") ;
	});
	//友情链接--起点8
	$("#qidian8_id").click(function() {
		window.open("https://www.qd8.com/") ;
	});
	//友情链接--中国失物招领网
	$("#zhongguoshiwuzhaoling_id").click(function() {
		window.open("http://www.cswzl.com/index.action?province=0_19&city=0_19_9") ;
	});
	//友情链接--桂林航天工业学院官网
	$("#xuexiao_id").click(function() {
		window.open("https://www.guat.edu.cn/") ;
	});
}
/**
 * 提交时表单验证
 * @param {Object} formId	表单id
 */
function saveFormValidator(formId) {
	var bootstrapValidator = $(formId).data('bootstrapValidator');
	bootstrapValidator.validate();
	if(!bootstrapValidator.isValid()){
		return ;
	}
}
/**
 * 	fileinput上传插件初始化（图片上传）
 */
function imgFileinputInitialization(imgFileId,fatherDivId,imgUrl) {
	$(imgFileId).remove();
	var uploadImg_id = "<input id='uploadImg_id' name='imgFile'  type='file' data-show-caption='true' />";
	$(fatherDivId).append(uploadImg_id);
	if(url==""){
		$(imgFileId).fileinput({
			language: 'zh', 									//设置语言
			allowedFileExtensions: ['jpg', 'gif', 'png'], 		//接收的文件后缀
			uploadAsync: false, 									//默认异步上传
			showUpload: false, 									//是否显示上传按钮
			showCaption: false, 								//是否显示标题
			removeLabel: "移除",
			previewFileType : ['image', 'html'],
			initialPreview : [],
			initialPreviewCount : 1,
			initialPreviewFileType : 'image',
			initialPreviewAsData:true,
			initialPreviewShowDelete:false,
			overwriteInitial:true,
			browseClass: "btn btn-primary", 					//按钮样式
			dropZoneEnabled: false, 							//是否显示拖拽区域
			maxFileSize: 1024*8,								//单位为kb，如果为0表示不限制文件大小
			maxFileCount: 1, 	//表示允许同时上传的最大文件个数
			msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
			autoReplace : true
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
	}else{
		$(imgFileId).fileinput({
			language: 'zh', 									//设置语言
			allowedFileExtensions: ['jpg', 'gif', 'png'], 		//接收的文件后缀
			uploadAsync: false, 									//默认异步上传
			showUpload: false, 									//是否显示上传按钮
			showCaption: false, 								//是否显示标题
			removeLabel: "移除",
			previewFileType : ['image', 'html'],
			initialPreview : imgUrl,
			initialPreviewCount : 1,
			initialPreviewFileType : 'image',
			initialPreviewAsData:true,
			initialPreviewShowDelete:false,
			overwriteInitial:true,
			browseClass: "btn btn-primary", 					//按钮样式
			dropZoneEnabled: false, 							//是否显示拖拽区域
			maxFileSize: 1024*8,								//单位为kb，如果为0表示不限制文件大小
			maxFileCount: 1, 	//表示允许同时上传的最大文件个数
			msgFilesTooMany: "选择上传的文件数量({n}) 超过允许的最大数值{m}！",
			autoReplace : true
		}).on('filepreupload', function(event, data, previewId, index) { //上传中
			var form = data.form,
			files = data.files,
			extra = data.extra,
			response = data.response,
			reader = data.reader;
			console.log('文件正在上传');
		}).on("fileuploaded", function(event, data, previewId, index) { //一个文件上传成功
			console.log('文件上传成功！');
			// console.log(data) ;
		}).on('fileerror', function(event, data, msg) { //一个文件上传失败
			console.log('文件上传失败！' + data.id);
		});
	}
}
/**
 * 日期控件初始化
 * @param {Object} id
 * @param {Object} minView
 */
function dateInitialization(id,minView) {
	//清除日期控件内容
	$(id).val("");
	var date = new Date() ;
	$(id).datetimepicker({
	   format: "yyyy-mm-dd hh:ii",
	   autoclose: true,
	   todayBtn: true,
	   todayHighlight: true,
	   clearBtn:true, //是否 工具栏显示  清空 输入框  的按钮。默认false
	   showMeridian: true,
	   pickerPosition: "bottom-left",
	   language: 'zh-CN',//中文，需要引用zh-CN.js包
	   startView: 2,//月视图
	   minView: minView,//日期时间选择器所能够提供的最精确的时间选择视图
	   startDate: new Date(),
	});
}
//校验用户是否登录
function checkUser(){
	var userInfo;
	$.ajax({
		url : url+'/getUser',
		type : 'get',
		async : false,
		xhrFields: {
			withCredentials: true
		},
		success:function(result) {
			// console.log(result) ;
			if(result.code == 10000) {
				userInfo = result.resp;
				if(result.resp == null || result.resp == "") {
					$("#welcome_span_id").text("");
					var str = '请<a href="#" onclick="toLogin()">登录</a>|<a href="#" onclick="toLogin()">免费注册</a>';					
					$("#welcome_span_id").append(str);
					$("#dropdown_id").css('display','none');
				}else {
					$("#welcome_span_id").text("尊敬的"+result.resp.userName+"欢迎您");
					$("#dropdown_id").css('display','inline-block');
				}
			}
		},
		error:function(result) {
		}
	});
	return userInfo;
}
function toLogin(){
	window.location.href = "../../html/loginAndRegister.html";
}
function toOrderManage(){
	window.location.href = "../../html/user/orderManage.html";
}
function toUserMain(){
	window.location.href = "../../html/user/userMain.html";
}
function toPay(orderId){
	window.location.href = "../../html/user/pay.html?orderId="+orderId;
}
function dateFormat(time) {
	var createTime = new Date(time);
	var o = {
		"M": createTime.getMonth() + 1, //月份 
		"d": createTime.getDate(), //日 
		"H": createTime.getHours(), //小时 
		"m": createTime.getMinutes(), //分 
		"s": createTime.getSeconds(), //秒 
	};
	return createTime.getFullYear()+"-"+o.M+"-"+o.d+" "+o.H+":"+o.m+":"+o.s ;
}