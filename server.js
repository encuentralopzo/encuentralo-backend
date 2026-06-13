const express = require('express');
const multer = require('multer');
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;
const EXCEL_PATH = './base_de_datos.xlsx';

// Configuración de almacenamiento para las imágenes
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static('uploads'));
app.use(express.urlencoded({ extended: true }));

// Mostrar el formulario al entrar a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Procesar el registro completo
app.post('/registrar', upload.array('imagenes', 5), async (req, res) => {
    try {
        const { nombre, rif, categoria, productos, direccion, maps_url, redes, whatsapp, horario } = req.body;
        const files = req.files;

        // Validación de cantidad de fotos (mínimo 1, máximo 5)
        if (!files || files.length === 0) {
            return res.status(400).send('<h2>Error: Debes subir al menos 1 foto de tu negocio.</h2><a href="/">Volver</a>');
        }
        if (files.length > 5) {
            return res.status(400).send('<h2>Error: El máximo permitido son 5 fotos.</h2><a href="/">Volver</a>');
        }

        // Creamos las URLs para las fotos que se hayan subido (las celdas vacías se quedan en blanco)
        const urlFotos = [];
        for (let i = 0; i < 5; i++) {
            if (files[i]) {
                urlFotos.push(`http://localhost:${PORT}/uploads/${files[i].filename}`);
            } else {
                urlFotos.push(''); // Celda vacía si el usuario subió menos de 5 fotos
            }
        }

        const workbook = new ExcelJS.Workbook();
        
        if (fs.existsSync(EXCEL_PATH)) {
            await workbook.xlsx.readFile(EXCEL_PATH);
        } else {
            const worksheet = workbook.addWorksheet('Directorio_PZO');
            // Definición exacta de las columnas requeridas
            worksheet.columns = [
                { header: 'Nombre Comercial', key: 'nombre', width: 25 },
                { header: 'RIF / Identificación', key: 'rif', width: 15 },
                { header: 'Categoría', key: 'categoria', width: 20 },
                { header: 'Productos / Rubro', key: 'productos', width: 30 },
                { header: 'Dirección Física', key: 'direccion', width: 35 },
                { header: 'Google Maps URL', key: 'maps_url', width: 25 },
                { header: 'Redes Sociales', key: 'redes', width: 25 },
                { header: 'WhatsApp Contacto', key: 'whatsapp', width: 15 },
                { header: 'Horario Semanal', key: 'horario', width: 30 },
                { header: 'Foto Fachada 1', key: 'foto1', width: 35 },
                { header: 'Foto Interior 2', key: 'foto2', width: 35 },
                { header: 'Foto Interior 3', key: 'foto3', width: 35 },
                { header: 'Foto Opcional 4', key: 'foto4', width: 35 },
                { header: 'Foto Opcional 5', key: 'foto5', width: 35 }
            ];
        }

        const worksheet = workbook.getWorksheet('Directorio_PZO');

        // Insertamos toda la fila de información ordenada
        worksheet.addRow([
            nombre, rif, categoria, productos, direccion, maps_url, redes, whatsapp, horario,
            urlFotos[0], urlFotos[1], urlFotos[2], urlFotos[3], urlFotos[4]
        ]);

        await workbook.xlsx.writeFile(EXCEL_PATH);

        res.send(`
            <div style="font-family:Arial,sans-serif; text-align:center; padding:50px;">
                <h2 style="color: #27ae60;">¡Negocio registrado con éxito en encuentralopzo.com!</h2>
                <p>Toda la información y las fotos han sido guardadas en la base de datos.</p>
                <br>
                <a href="/" style="background:#ff9900; color:white; padding:10px 20px; text-decoration:none; border-radius:4px; font-weight:bold;">Registrar otro negocio</a>
            </div>
        `);

    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno en el servidor.');
    }
});

PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Sistema de Carga corriendo en: http://localhost:${PORT}`);
});
