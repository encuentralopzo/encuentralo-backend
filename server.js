const express = require('express');
const app = express();
const path = require('path');

// Permitir que el servidor entienda los datos que envían los formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Una lista en memoria para guardar los comercios que se vayan registrando
const comerciosRegistrados = [];

// 1. RUTA PRINCIPAL: Muestra la página web con el formulario de registro
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Registro - Encuéntralo en PZO</title>
            <style>
                body { font-family: Arial, sans-serif; background-color: #f4f4f9; padding: 20px; display: flex; flex-direction: column; align-items: center; }
                .container { background: white; padding: 30px; border-radius: 8px; box-shadow: 0px 4px 10px rgba(0,0,0,0.1); width: 100%; max-width: 400px; }
                h2 { color: #333; text-align: center; margin-bottom: 20px; }
                label { font-weight: bold; color: #555; }
                input { width: 100%; padding: 10px; margin: 8px 0 20px 0; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
                button { width: 100%; background-color: #007bff; color: white; padding: 12px; border: none; border-radius: 4px; font-size: 16px; cursor: pointer; }
                button:hover { background-color: #0056b3; }
                .comercio-card { background: #e9ecef; padding: 10px; margin: 5px 0; border-radius: 4px; width: 100%; }
            </style>
        </head>
        <body>
            <div class="container">
                <h2>Registra tu Comercio en PZO</h2>
                <form action="/registrar" method="POST">
                    <label>Nombre del Comercio:</label>
                    <input type="text" name="nombre" placeholder="Ej. Repuestos San Félix" required>

                    <label>Teléfono de Contacto:</label>
                    <input type="tel" name="telefono" placeholder="Ej. 0414-1234567" required>

                    <label>Categoría / Rubro:</label>
                    <input type="text" name="categoria" placeholder="Ej. Restaurante, Mecánico" required>

                    <button type="submit">Unirme al Directorio</button>
                </form>
            </div>

            <div class="container" style="margin-top: 20px;">
                <h3>Comercios Registrados hasta ahora:</h3>
                <div id="lista">${comerciosRegistrados.length === 0 ? '<p>No hay comercios registrados aún.</p>' : ''}</div>
            </div>
        </body>
        </html>
    `);
});

// 2. RUTA DE PROCESAMIENTO: Recibe los datos del formulario y los guarda
app.post('/registrar', (req, res) => {
    const { nombre, telefono, categoria } = req.body;
    
    // Guardamos el nuevo comercio en nuestra lista temporal
    comerciosRegistrados.push({ nombre, telefono, categoria });
    
    // Mostramos una pantalla de éxito y un botón para volver
    res.send(`
        <div style="text-align: center; font-family: Arial; margin-top: 50px;">
            <h2 style="color: green;">¡Comercio registrado con éxito en Encuéntralo en PZO! 🎉</h2>
            <p>Gracias por sumarte. Ya guardamos tus datos.</p>
            <br>
            <a href="/" style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Volver al formulario</a>
        </div>
    `);
});

// Configuración del Puerto Automático para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`Servidor corriendo en el puerto \${PORT}\`);
});
