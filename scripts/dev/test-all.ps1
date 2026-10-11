$ErrorActionPreference = "Continue"
Write-Host "============ PRUEBA EXHAUSTIVA ADSUM ============`n" -ForegroundColor Cyan

# TEST 1: LOGIN ADMIN
Write-Host "TEST 1: LOGIN ADMIN" -ForegroundColor Yellow
try {
    $adminLogin = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body (@{email='admin@adsum.cat';password='admin123'} | ConvertTo-Json) -ContentType 'application/json'
    $adminToken = $adminLogin.access_token
    $adminHeaders = @{ Authorization = "Bearer $adminToken" }
    Write-Host "  OK - Token: $($adminToken.Substring(0,20))..." -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 2: LOGIN ALUMNE
Write-Host "`nTEST 2: LOGIN ALUMNE" -ForegroundColor Yellow
try {
    $alumneLogin = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body (@{email='alumne@adsum.cat';password='alumne123'} | ConvertTo-Json) -ContentType 'application/json'
    $alumneToken = $alumneLogin.access_token
    $alumneHeaders = @{ Authorization = "Bearer $alumneToken" }
    Write-Host "  OK" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 3: LOGIN PROFESSOR
Write-Host "`nTEST 3: LOGIN PROFESSOR" -ForegroundColor Yellow
try {
    $profLogin = Invoke-RestMethod -Uri 'http://localhost:3000/api/auth/login' -Method Post -Body (@{email='professor@adsum.cat';password='profe123'} | ConvertTo-Json) -ContentType 'application/json'
    $profToken = $profLogin.access_token
    $profHeaders = @{ Authorization = "Bearer $profToken" }
    Write-Host "  OK" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 4: ADMIN - ESTADISTICAS
Write-Host "`nTEST 4: ADMIN ESTADISTICAS" -ForegroundColor Yellow
try {
    $stats = Invoke-RestMethod -Uri 'http://localhost:3000/api/admin/stats' -Method Get -Headers $adminHeaders
    Write-Host "  OK - Absence Rate: $($stats.absenceRate)%" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 5: ADMIN - LISTAR USUARIOS
Write-Host "`nTEST 5: ADMIN LISTAR USUARIOS" -ForegroundColor Yellow
try {
    $users = Invoke-RestMethod -Uri 'http://localhost:3000/api/usuaris' -Method Get -Headers $adminHeaders
    Write-Host "  OK - Total usuarios: $($users.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 6: ALUMNE - NOTAS
Write-Host "`nTEST 6: ALUMNE NOTAS" -ForegroundColor Yellow
try {
    $notes = Invoke-RestMethod -Uri 'http://localhost:3000/api/usuaris/3/notes' -Method Get -Headers $alumneHeaders
    Write-Host "  OK - Total notas: $($notes.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 7: ALUMNE - HORARIO
Write-Host "`nTEST 7: ALUMNE HORARIO" -ForegroundColor Yellow
try {
    $schedule = Invoke-RestMethod -Uri 'http://localhost:3000/api/horari/alumne/3' -Method Get -Headers $alumneHeaders
    Write-Host "  OK" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 8: ALUMNE - ASSISTENCIA
Write-Host "`nTEST 8: ALUMNE ASSISTENCIA" -ForegroundColor Yellow
try {
    $assist = Invoke-RestMethod -Uri 'http://localhost:3000/api/assistencia/alumne/3' -Method Get -Headers $alumneHeaders
    Write-Host "  OK - Total registros: $($assist.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 9: RECURSOS - LISTAR
Write-Host "`nTEST 9: RECURSOS LISTAR" -ForegroundColor Yellow
try {
    $recursos = Invoke-RestMethod -Uri 'http://localhost:3000/api/recursos' -Method Get -Headers $alumneHeaders
    Write-Host "  OK - Total recursos: $($recursos.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 10: PROFESSOR - MODULOS
Write-Host "`nTEST 10: PROFESSOR MODULOS" -ForegroundColor Yellow
try {
    $modulos = Invoke-RestMethod -Uri 'http://localhost:3000/api/moduls' -Method Get -Headers $profHeaders
    Write-Host "  OK - Total modulos: $($modulos.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

# TEST 11: CHAT - LISTA USUARIOS
Write-Host "`nTEST 11: CHAT USUARIOS" -ForegroundColor Yellow
try {
    $chatUsers = Invoke-RestMethod -Uri 'http://localhost:3000/api/chat/usuarios' -Method Get -Headers $alumneHeaders
    Write-Host "  OK - Total usuarios chat: $($chatUsers.Count)" -ForegroundColor Green
} catch {
    Write-Host "  FALLO: $($_)" -ForegroundColor Red
}

Write-Host "`n============ FIN PRUEBAS ============`n" -ForegroundColor Cyan
