//定义没有依赖的模块：
define(function(){
	let msg = 'module1';
    function getMsg(){
        return msg;
    }
    return {getMsg};
})