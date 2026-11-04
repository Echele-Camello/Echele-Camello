@echo off
REM ==============================================================================
REM Batch launcher for Liquibase on Windows (EcheleCamelloPrueba)
REM ==============================================================================

setlocal

if exist "C:\Users\USER\.tools\jre\bin\java.exe" (
    set "JAVA_HOME=C:\Users\USER\.tools\jre"
    set "PATH=C:\Users\USER\.tools\jre\bin;%PATH%"
)

set "LIQUIBASE_EXE=C:\Users\USER\.tools\liquibase\liquibase.bat"
if not exist "%LIQUIBASE_EXE%" (
    echo [ERROR] Liquibase not found at C:\Users\USER\.tools\liquibase\liquibase.bat
    exit /b 1
)

pushd "%~dp0"
if "%~1"=="" (
    call "%LIQUIBASE_EXE%" --defaults-file="liquibase.properties" update
) else (
    call "%LIQUIBASE_EXE%" --defaults-file="liquibase.properties" %*
)
popd

endlocal

