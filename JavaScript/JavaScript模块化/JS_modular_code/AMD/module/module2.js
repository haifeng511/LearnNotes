// 定义有依赖的模块：
define(['module1','jquery'],function(m1,m2){
    let msg = 'module2';
    function getMsg(){
        m2('body').css('background', 'blue')
        console.log('m1:'+ m1.getMsg());
        console.log('m2:'+ msg);
    }
	return {getMsg}
})