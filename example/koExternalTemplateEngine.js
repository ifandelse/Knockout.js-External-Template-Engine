// Knockout External jQuery Template Engine
// Author: Jim Cowart (primarily tweaking Steve Sanderson's original [and already awesome] template engine)
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 1.0
(function(window,undefined){ 
if(typeof ko=="undefined")throw"You must reference Knockout.js in order for the ko.ExternaljQueryTemplateEngine to work.";else ko.ExternaljQueryTemplateEngine=function(){ko.jqueryTmplTemplateEngine.call(this,arguments);this.templateUrl="";this.templateSuffix=".html";this.templatePrefix="";this.useDefaultErrorTemplate=!0;this.defaultErrorTemplateHtml="<div style='font-style: italic;'>The template could not be loaded.  HTTP Status code: {STATUSCODE}.</div>";this.timeout=0;this.getTemplateNode=function(a){var c=
document.getElementById(a);if(c==null){var b=null;$.ajax({url:this.a(a),async:!1,dataType:"html",type:"GET",timeout:this.timeout,success:function(a){b=a},error:function(a){this.useDefaultErrorTemplate&&(b=this.defaultErrorTemplateHtml.replace("{STATUSCODE}",a.status))}.bind(this)});if(b===null)throw Error("Cannot find template with ID="+a);c=$("<script/>",{type:"text/html",id:a,text:b}).appendTo("body")}return c};this.a=function(a){a=this.templatePrefix+a+this.templateSuffix;return this.templateUrl==
void 0||this.templateUrl==""?a:this.templateUrl+"/"+a};this.setOptions=function(a){a.templateUrl&&(this.templateUrl=a.templateUrl);a.templatePrefix&&(this.templatePrefix=a.templatePrefix);a.templateSuffix&&(this.templateSuffix=a.templateSuffix);a.useDefaultErrorTemplate&&(this.useDefaultErrorTemplate=a.useDefaultErrorTemplate);a.defaultErrorTemplateHtml&&(this.defaultErrorTemplateHtml=a.defaultErrorTemplateHtml);a.timeout&&(this.timeout=a.timeout)}},ko.ExternaljQueryTemplateEngine.prototype=new ko.templateEngine,
ko.externaljQueryTemplateEngine=new ko.ExternaljQueryTemplateEngine,ko.setTemplateEngine(ko.externaljQueryTemplateEngine);
})(window);                  
