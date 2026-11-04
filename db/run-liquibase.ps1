# ==============================================================================
# Script de Ejecución de Liquibase para Échele Camello
# Configura Java y ejecuta Liquibase apuntando a XAMPP MySQL (echelecamelloprueba)
# ==============================================================================

param(
    [Parameter(ValueFromRemainingArguments = $true)]
    [string[]]$LiquibaseArgs = @("update")
)

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

# 1. Resolver Java Runtime
$javaCandidates = @(
    "C:\Users\USER\.tools\jre",
    "$env:LOCALAPPDATA\Programs\Eclipse Adoptium\*",
    "$env:JAVA_HOME"
)

$resolvedJava = $null
foreach ($cand in $javaCandidates) {
    if ($cand -and (Test-Path "$cand\bin\java.exe")) {
        $resolvedJava = (Resolve-Path $cand).Path
        break
    }
}

if ($resolvedJava) {
    $env:JAVA_HOME = $resolvedJava
    $env:PATH = "$resolvedJava\bin;$env:PATH"
}

# 2. Resolver Liquibase CLI
$liquibaseCandidates = @(
    "C:\Users\USER\.tools\liquibase\liquibase.bat",
    "$env:LOCALAPPDATA\Programs\Liquibase\liquibase.bat"
)

$resolvedLiquibase = $null
foreach ($lq in $liquibaseCandidates) {
    if (Test-Path $lq) {
        $resolvedLiquibase = $lq
        break
    }
}

if (-not $resolvedLiquibase) {
    Write-Error "No se encontro el ejecutable de Liquibase. Asegurate de que este en C:\Users\USER\.tools\liquibase."
    exit 1
}

# 3. Ejecutar Liquibase con las propiedades del proyecto
Push-Location $scriptDir
try {
    & $resolvedLiquibase --defaults-file="liquibase.properties" @LiquibaseArgs
}
finally {
    Pop-Location
}

