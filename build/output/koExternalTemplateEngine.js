// Knockout External jQuery Template Engine
// Author: Jim Cowart (primarily tweaking Steve Sanderson's original [and already awesome] template engine)
// License: MIT (http://www.opensource.org/licenses/mit-license)
// Version 1.0
(function(window,undefined){ 
if(typeof ko=="undefined")throw"You must reference Knockout.js in order for the ko.externaljQueryTemplateEngine to work.";else ko.a=function(){ko.d.call(this,arguments);this.templateUrl="";this.templateSuffix=".html";this.templatePrefix="";this.useDefaultErrorTemplate=!0;this.defaultErrorTemplateHtml="<div style='font-style: italic;'>The template could not be loaded.  HTTP Status code: {STATUSCODE}.</div>";this.timeout=0;this.getTemplateNode=function(a){var b=document.getElementById(a);if(b==null){var b=
this.getTemplatePath(a),c=null;$.ajax({url:b,async:!1,dataType:"html",type:"GET",timeout:this.timeout,success:function(a){c=a},error:function(a){this.useDefaultErrorTemplate&&(c=this.defaultErrorTemplateHtml.replace("{STATUSCODE}",a.status))}.bind(this)});if(c===null)throw Error("Cannot find template with ID="+a);b=$("<script/>",{type:"text/html",id:a,text:c}).b("body")}return b};this.c=function(a){a=this.templatePrefix+a+this.templateSuffix;return this.templateUrl==void 0||this.templateUrl==""?a:
this.templateUrl+"/"+a}},ko.a.prototype=new ko.templateEngine,externaljQueryTemplateEngine=new ko.a,ko.setTemplateEngine(externaljQueryTemplateEngine);
})(window);                  
