// Knockout External jQuery Template Engine
// Author: Jim Cowart (primarily tweaking Steve Sanderson's original [and already awesome] template engine)
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 1.0
(function(window,undefined){ 
if(typeof ko=="undefined")throw"You must reference Knockout.js in order for the ko.ExternaljQueryTemplateEngine to work.";else ko.ExternaljQueryTemplateEngine=function(){ko.jqueryTmplTemplateEngine.call(this,arguments);this.templateUrl="";this.templateSuffix=".html";this.templatePrefix="";this.useDefaultErrorTemplate=!0;this.defaultErrorTemplateHtml="<div style='font-style: italic;'>The template could not be loaded.  HTTP Status code: {STATUSCODE}.</div>";this.timeout=0;this.getTemplateNode=function(a){var b=
document.getElementById(a);if(b==null){var b=this.getTemplatePath(a,this.templatePrefix,this.templateSuffix,this.templateUrl),c=null;$.ajax({url:b,async:!1,dataType:"html",type:"GET",timeout:this.timeout,success:function(a){c=a},error:function(a){this.useDefaultErrorTemplate&&(c=this.defaultErrorTemplateHtml.replace("{STATUSCODE}",a.status))}.bind(this)});if(c===null)throw Error("Cannot find template with ID="+a);b=$("<script/>",{type:"text/html",id:a,text:c}).appendTo("body")}return b};this.getTemplatePath=
function(a,b,c,d){a=b+a+c;return d===void 0||d===""?a:d+"/"+a};this.setOptions=function(a){$.extend(this,a)}},ko.ExternaljQueryTemplateEngine.prototype=new ko.templateEngine,ko.externaljQueryTemplateEngine=new ko.ExternaljQueryTemplateEngine,ko.setTemplateEngine(ko.externaljQueryTemplateEngine);
})(window);                  
