# FMDataMigration Assistant

Interfaz gráfica local para la herramienta de línea de comandos **Claris FileMaker Data Migration Tool** (`FMDataMigration`).

Un único archivo HTML autocontenido — sin instalación, sin dependencias, sin servidor. Ábrelo directamente en cualquier navegador moderno en macOS, Windows o Linux.

---

## Características

- **Formulario completo** con todos los parámetros oficiales de FMDataMigration
- **Ayuda contextual** para cada parámetro: descripción, consejos y avisos extraídos de la documentación oficial de Claris, accesibles con el botón `?`
- **Generación de comando** en tiempo real conforme rellenas el formulario
- **Descarga de script `.sh`** listo para ejecutar en Terminal, con gestión de errores y código de retorno
- **Notificación push** al móvil vía [Pushover](https://pushover.net) al terminar (éxito o fallo), integrada en el script generado
- **Configuraciones guardadas** con nombre en `localStorage`, exportables e importables como JSON para compartir entre máquinas
- Mutex automático entre `-v` y `-q` (verbose/quiet son incompatibles)
- Contraseñas enmascaradas en todos los campos sensibles

---

## Parámetros soportados

| Parámetro | Descripción |
|---|---|
| `-src_path` | Archivo FileMaker fuente (obligatorio) |
| `-src_account` | Cuenta de acceso al archivo fuente |
| `-src_pwd` | Contraseña del archivo fuente |
| `-src_key` | Clave de cifrado del archivo fuente (Encryption at Rest) |
| `-clone_path` | Archivo clon (obligatorio) |
| `-clone_account` | Cuenta de acceso al clon |
| `-clone_pwd` | Contraseña del clon |
| `-clone_key` | Clave de cifrado del clon |
| `-target_path` | Ruta del archivo destino resultante |
| `-plugin_folder` | Carpeta de plugins |
| `-ignore_fonts` | No comprobar mapeo de fuentes |
| `-ignore_accounts` | Usar cuentas del clon en lugar del origen |
| `-ignore_valuelists` | Usar listas de valores del clon en lugar del origen |
| `-v` | Verbose — informe detallado |
| `-q` | Quiet — sin informe |
| `-rebuildindexes` | Reconstruir índices durante la migración |
| `-reevaluate` | Reevaluar todos los cálculos almacenados |
| `-force` | Sobreescribir el archivo destino si ya existe |
| `-target_locale` | Locale del archivo destino (nombre predefinido o ruta a JSON) |

Referencia oficial: [Claris FileMaker Data Migration Tool Guide](https://help.claris.com/en/data-migration-tool-guide/content/migrate-data.html)

---

## Uso

### 1. Obtener FMDataMigration Assistant

Descarga el archivo `FMDataMigration Assistant.html` desde [Releases](../../releases) o directamente desde este repositorio.

### 2. Abrir en el navegador

```bash
open "FMDataMigration Assistant.html"   # macOS
# o simplemente arrastra el archivo al navegador
```

No requiere servidor web ni instalación de nada.

### 3. Rellenar el formulario

1. Especifica la ruta al ejecutable `FMDataMigration`
2. Rellena las rutas del archivo fuente y el clon
3. Introduce las credenciales necesarias
4. Activa o desactiva las opciones según necesites (usa `?` para ver la ayuda de cada una)
5. Opcionalmente configura Pushover para recibir notificación al móvil

### 4. Generar el script

Haz clic en **▶ Generar script** para descargar `fm_migrate.sh`, o **📋 Copiar** para copiar el comando directamente.

```bash
chmod +x fm_migrate.sh && ./fm_migrate.sh
```

### 5. Guardar la configuración

Dale un nombre a la configuración y pulsa **💾 Guardar** para guardarla en el navegador. Usa **📤 Exportar JSON** para llevártela a otro ordenador.

---

## Notificaciones Pushover

Para recibir una notificación push al móvil al terminar la migración:

1. Crea una cuenta en [pushover.net](https://pushover.net)
2. Crea una aplicación en [pushover.net/apps/build](https://pushover.net/apps/build) para obtener el **API Token**
3. Copia tu **User Key** desde el dashboard
4. Introduce ambos en la sección *Notificación Pushover* de la app
5. El script `.sh` generado incluirá automáticamente la llamada a la API de Pushover

El script envía prioridad normal (0) en caso de éxito y prioridad alta (1) en caso de error.

---

## Ubicaciones del ejecutable FMDataMigration

| Sistema | Ruta |
|---|---|
| macOS (con FileMaker Server) | `/Library/FileMaker Server/Database Server/bin/FMDataMigration` |
| macOS (standalone) | Donde hayas descomprimido el `.zip` descargado |
| Windows (con FileMaker Server) | `C:\Program Files\FileMaker\FileMaker Server\Database Server\FMDataMigration` |
| Ubuntu (con FileMaker Server) | `/opt/FileMaker/FileMaker Server/Database Server/bin/FMDataMigration` |

Descarga standalone: [Claris FileMaker Data Migration Tool](https://community.claris.com/en/s/article/FileMaker-data-migration-tool)

---

## Requisitos

- Navegador moderno con soporte de `localStorage` (Chrome, Firefox, Safari, Edge)
- `FMDataMigration` instalado en el sistema donde se ejecutará el script
- `curl` disponible en el sistema (para las notificaciones Pushover)

---

## Licencia

MIT — úsalo, modifícalo y distribúyelo libremente.
