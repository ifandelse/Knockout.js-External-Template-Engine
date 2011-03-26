@echo off 
set OutDebugFile=output\koExternalTemplateEngine.debug.js
set OutMinFile=output\koExternalTemplateEngine.js
set AllFiles=
for /f "eol=] skip=1 delims=' " %%i in (source-references.js) do set Filename=%%i& call :Concatenate 

goto :Combine
:Concatenate 
    if /i "%AllFiles%"=="" ( 
        set AllFiles=..\%Filename:/=\%
    ) else ( 
        set AllFiles=%AllFiles% ..\%Filename:/=\%
    ) 
goto :EOF 

:Combine
type %AllFiles%                   > %OutDebugFile%.temp

@rem Now call UglifyJS to produce a minified version
copy /y version-header.js %OutMinFile%
tools\curl --data-urlencode js_code@%OutDebugFile%.temp "http://marijnhaverbeke.nl/uglifyjs" > %OutMinFile%.temp

@rem Finalise each file by prefixing with version header and surrounding in function closure
copy /y version-header.js %OutDebugFile%
type %OutDebugFile%.temp		  >> %OutDebugFile%
del %OutDebugFile%.temp

copy /y version-header.js %OutMinFile%
type %OutMinFile%.temp		  	  >> %OutMinFile%
del %OutMinFile%.temp