<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Pre-Uso Maquinaria FT-231</title>
  <style>
    body { font-family: Arial, sans-serif; padding: 15px; background-color: #f4f4f9; margin: 0; }
    .container { max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    h2 { text-align: center; color: #333; font-size: 20px; margin-top: 0; }
    label { font-weight: bold; display: block; margin-top: 15px; font-size: 14px; }
    input, select, textarea { width: 100%; padding: 10px; margin-top: 5px; box-sizing: border-box; border: 1px solid #ccc; border-radius: 4px; font-size: 14px; }
    button { width: 100%; padding: 15px; margin-top: 25px; background-color: #2e7d32; color: white; border: none; border-radius: 4px; font-size: 16px; font-weight: bold; cursor: pointer; }
    button:disabled { background-color: #75a478; cursor: not-allowed; }
    .status { margin-bottom: 15px; padding: 10px; text-align: center; border-radius: 4px; font-weight: bold; font-size: 14px; }
    .online { background-color: #d4edda; color: #155724; }
    .offline { background-color: #f8d7da; color: #721c24; }
    .seccion { margin-top: 10px; background: #e3f2fd; padding: 12px; border-radius: 5px; cursor: pointer; }
    summary { font-weight: bold; font-size: 15px; }
    .oculto { display: none; }
  </style>
</head>
<body>

<div class="container">
  <div id="statusBanner" class="status offline">Sin internet. Modo Offline activo.</div>

  <h2>Pre-Uso Maquinaria FT-231</h2>
  <form id="formularioOffline">

    <label>Nombre del Operador *</label>
    <input type="text" id="operador" required autocomplete="off">

    <label>Obra y/o Proyecto *</label>
    <select id="obra" required>
      <option value="">Seleccione...</option>
      <option value="1. ORIENTE (Rubiales - Caño sur - Gaitán)">1. ORIENTE (Rubiales - Caño sur - Gaitán)</option>
      <option value="2. LLANOS (Villavicencio - Acacías - Castilla)">2. LLANOS (Villavicencio - Acacías - Castilla)</option>
      <option value="3. REFINERÍA">3. REFINERÍA</option>
    </select>

    <label>Foto Horómetro Inicial *</label>
    <input type="file" id="fotoHorometro" accept="image/*" capture="environment" required>

    <label>Tipo de Activo *</label>
    <select id="tipoActivo" required onchange="mostrarPlacas()">
      <option value="">Seleccione...</option>
      <option value="AUTOHORMIGONERA">AUTOHORMIGONERA</option>
      <option value="BULLDOZER">BULLDOZER</option>
      <option value="EXCAVADORA">EXCAVADORA</option>
      <option value="RETROCARGADOR">RETROCARGADOR</option>
      <option value="MINICARGADOR">MINICARGADOR</option>
      <option value="MONTACARGAS">MONTACARGAS</option>
      <option value="MOTONIVELADORA">MOTONIVELADORA</option>
      <option value="PLATAFORMA ELEVADORA (Boom-Lift / Manlif)">PLATAFORMA ELEVADORA (Boom-Lift / Manlif)</option>
      <option value="VIBROCOMPACTADOR">VIBROCOMPACTADOR</option>
    </select>

    <div id="contenedorPlacas" class="oculto">
      <label>No. Registro *</label>
      <select id="placa" required></select>
    </div>

    <div id="seccionInspeccion" class="oculto">
      <h3 style="margin-top:25px; border-bottom:2px solid #ccc; padding-bottom:5px;">INSPECCIÓN</h3>
      <div id="preguntasDinamicas"></div>

      <label style="margin-top:20px;">Estado General Máquina *</label>
      <select id="estado" required>
        <option value="Operativo">Operativo</option>
        <option value="Inoperativo">Inoperativo</option>
      </select>

      <label>Detalles / Novedades encontradas</label>
      <textarea id="novedadTexto" rows="3" placeholder="(M) Mecánico, (P) Pintura, (G) Golpe..."></textarea>

      <label>Foto de la novedad (Opcional)</label>
      <input type="file" id="fotoNovedad" accept="image/*" capture="environment">

      <button type="submit" id="btnEnviar">Guardar Inspección</button>
    </div>
  </form>

  <p style="text-align:center; font-size:12px; margin-top:15px;">
    Registros pendientes por sincronizar: <span id="contador">0</span>
  </p>
</div>

<script>

  const URL_APPS_SCRIPT = "https://script.google.com/macros/s/AKfycbzfRJHZZLfMm_wF6Kyx95pYFuyu4LaqoczOi_Yv5N5kBaDoxQRB0x6wsLF8inYUQB9dOg/exec";

  const todasLasPreguntas = {
    "1. LUCES": {
      "lucesDelanteras":       "Frontales",
      "luzTrasera":            "Traseras",
      "lucesExploradoras":     "Exploradoras (reflector)",
      "lucesStopTraseras":     "De Stop y señal trasera"
    },
    "2. CABINA": {
      "cabinaEstructura":          "Estructura de la Cabina",
      "cabinaPuerta":              "Puerta",
      "cabinaProteccion":          "Protección antivuelco (R.O.P.S.) Certificada",
      "cabinaEscalera":            "Escaleras y apoyos de acceso seguros",
      "cabinaBateria":             "Baterías y cables en buen estado",
      "cabinaVidrioFrontal":       "Vidrio frontal",
      "cabinaEspejoCentral":       "Espejo central convexo",
      "cabinaEspejosRetrovisores": "Espejos retrovisores laterales",
      "cabinaIluminacion":         "Iluminación cabina",
      "cabinaAsiento":             "Asiento (dispositivos de giro)",
      "cabinaCinturonSeguridad":   "Cinturón de seguridad Silla del operador",
      "cabinaPlumilla":            "Plumillas / nivel de agua"
    },
    "3. NIVELES": {
      "nivelAceiteMotor":      "Aceite del motor",
      "nivelAceiteHidraulico": "Aceite hidráulico",
      "nivelRefrierante":      "Refrigerante",
      "nivelLiquidoFreno":     "Líquido frenos",
      "nivelBateria":          "Baterías",
      "nivelCombustible":      "Nivel de combustible"
    },
    "4. DISPOSITIVOS SEGURIDAD": {
      "dispositivoPito":            "Pito",
      "dispositivoAlarma":          "Alarma de desplazamiento",
      "dispositivoFrenoServicio":   "Freno de servicio / parqueo",
      "dispositivoFrenoEmergencia": "Freno de emergencia",
      "dispositivoPedales":         "Pedales",
      "dispositivoControles":       "Controles / palancas de mando",
      "dispositivoHumo":            "Control ingreso humo (tubo de escape)",
      "dispositivoExtintor":        "Extintor reglamentario",
      "dispositivoBotiquin":        "Botiquín de Primeros Auxilios",
      "dispositivokit":             "Kit Ambiental"
    },
    "5. LLANTAS / ORUGAS": {
      "llantasHuella":     "En buen estado huella mínima de 3mm",
      "llantasCortaduras": "No se evidencian cortaduras profundas",
      "llantasBultos":     "No se evidencian abultamientos"
    },
    "6. ESTADO MECÁNICO": {
      "EMComportamientoMotor": "Compartimiento del motor aseado",
      "EMBateria":             "Estado de baterías y cables",
      "EMFiltroAire":          "Filtro de aire",
      "EMCombustible":         "Tanque de combustible, drenado del agua y sedimentos, fugas",
      "EMSistRefrigeracion":   "Rejillas del sistema de enfriamiento, sin obstrucciones",
      "EMManometro":           "Manómetros ajustados y en el rango operativo",
      "EMAbrazaderas":         "Verificar que no haya abrazaderas sueltas o flojas",
      "EMSoldaduras":          "Soldaduras",
      "EMChasis":              "Chasis / grietas, deformaciones",
      "EMOrugas":              "Orugas / elementos de apoyo",
      "EMCadenas":             "Cadenas",
      "EMRodamientos":         "Rodamientos o Carriles",
      "EMZapatas":             "Zapatas",
      "EMRodillos":            "Rodillos inferiores y superiores",
      "EMGuayas":              "Guayas",
      "EMMangueras":           "Manguera de agua y de alta presión",
      "EMRuedasTensoras":      "Rueda tensora sin desgaste excesivo",
      "EMPasadores":           "Pasadores ajustados, pines y sus Eslabones",
      "EMEstadoGeneralBalde":  "Estado general desgarrador / balde / ojete para carga",
      "EMEstadoDientes":       "Estado de los dientes o uñas del balde",
      "EMSistHidraulico":      "Función hidráulica: mangueras, conectores, cilindros, tanque, fugas",
      "EMBoom":                "Boom (sin soldadura ajena a las originales)",
      "EMMecanismoViraje":     "Mecanismo de viraje",
      "EMDireccion":           "Dirección (terminales, bomba hidráulica)",
      "EMCajaCambios":         "Caja de cambios",
      "EMBrazoExcavador":      "Mecanismo de giro (brazo excavador)",
      "EMMandosBrazo":         "Mandos de levante del brazo",
      "EMArticulacionBrazo":   "Articulación brazo de giro"
    },
    "7. DOCUMENTOS": {
      "docConductor":              "Pase del Conductor",
      "docSeguroConductor":        "Seguro del Conductor (ARL - EPS)",
      "docPolizaTRG":              "[TRG] Póliza seguro Todo Riesgo",
      "docDeclaracionImportacion": "Declaración de importación",
      "docDeclaracionLiquidos":    "Certificados de líquidos penetrantes",
      "docTarjetaRegistro":        "Tarjeta de registro (copia)",
      "docRCEExtracontractual":    "[RCE] Responsabilidad Civil Extracontractual"
    },
    "8. INVENTARIO": {
      "invAntena":       "Antena",
      "invForros":       "Forros",
      "invTapetes":      "Tapetes",
      "invBotiquin":     "Botiquín",
      "invLinterna":     "Linternas",
      "invChaleco":      "Chaleco reflectivo",
      "invSenales":      "Señales",
      "invConos":        "Conos",
      "invHerramientas": "Herramientas"
    }
  };

  const maquinasYPlacas = {
    "AUTOHORMIGONERA": ["MC317494 CARMIX 2.5TT"],
    "BULLDOZER": ["MC009862 KOMATSU D51-PX"],
    "EXCAVADORA": ["MC009863 KOMATSU PC200-8M0","MC202041 CATERPILLAR 320","MC379295 CATERPILLAR 320","MC451095 CATERPILLAR 313D2L","MC622828 BOBCAT E50Z","MC647167 HITACHI ZX60-5A","MC747252 KOMATSU PC45MR-5M0"],
    "RETROCARGADOR": ["MC731980 CATERPILLAR 420"],
    "MINICARGADOR": ["MC022680 CATERPILLAR 236 D","MC035787 CATERPILLAR 236 B","MC067510 CATERPILLAR 236 D"],
    "MONTACARGAS": ["MI032140 CATERPILLAR GP 30NM"],
    "MOTONIVELADORA": ["MC035785 CATERPILLAR 120H"],
    "PLATAFORMA ELEVADORA (Boom-Lift / Manlif)": ["MI116517 NIFTY HR-17 HYBRID"],
    "VIBROCOMPACTADOR": ["MC069370 AMMANN ASC 100","MC083064 DYNAPAC CC900","MC092430 CATERPILLAR CB 2.7"]
  };

  (function inicializarFormulario() {
    const contenedor = document.getElementById('preguntasDinamicas');
    let html = "";
    for (const categoria in todasLasPreguntas) {
      html += `<details class="seccion"><summary>${categoria}</summary><div style="padding-top:10px;">`;
      const items = todasLasPreguntas[categoria];
      for (const clave in items) {
        html += `<label style="font-weight:normal;">${items[clave]}</label>
                 <select id="${clave}">
                   <option value="B">Bueno</option>
                   <option value="M">Malo</option>
                   <option value="N/A">N/A</option>
                 </select>`;
      }
      html += `</div></details>`;
    }
    contenedor.innerHTML = html;
  })();

  function mostrarPlacas() {
    const sel = document.getElementById('tipoActivo').value;
    const placaBox = document.getElementById('placa');
    placaBox.innerHTML = '<option value="">Seleccione...</option>';
    if (sel && maquinasYPlacas[sel]) {
      maquinasYPlacas[sel].forEach(p => {
        placaBox.innerHTML += `<option value="${p}">${p}</option>`;
      });
      document.getElementById('contenedorPlacas').classList.remove('oculto');
      document.getElementById('seccionInspeccion').classList.remove('oculto');
    } else {
      document.getElementById('contenedorPlacas').classList.add('oculto');
      document.getElementById('seccionInspeccion').classList.add('oculto');
    }
  }

  function actualizarEstado() {
    const banner = document.getElementById('statusBanner');
    if (navigator.onLine) {
      banner.textContent = 'Conectado. Sincronización activa';
      banner.className = 'status online';
      sincronizarDatosGuardados();
    } else {
      banner.textContent = 'Sin internet. Modo Offline activo.';
      banner.className = 'status offline';
    }
    const pendientes = JSON.parse(localStorage.getItem('reg_maq') || '[]');
    document.getElementById('contador').innerText = pendientes.length;
  }

  window.addEventListener('online',  actualizarEstado);
  window.addEventListener('offline', actualizarEstado);

  function getBase64Comprimido(file, cb) {
    if (!file) { cb(""); return; }
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = new Image();
      img.onload = function() {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 600;
        let width  = img.width;
        let height = img.height;
        if (width > MAX_WIDTH) {
          height = Math.round((height * MAX_WIDTH) / width);
          width  = MAX_WIDTH;
        }
        canvas.width  = width;
        canvas.height = height;
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);
        cb(canvas.toDataURL('image/jpeg', 0.4));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  document.getElementById('formularioOffline').addEventListener('submit', function(e) {
    e.preventDefault();
    const btn = document.getElementById('btnEnviar');
    btn.innerText = "Guardando localmente...";
    btn.disabled  = true;

    getBase64Comprimido(document.getElementById('fotoHorometro').files[0], function(b64Horo) {
      getBase64Comprimido(document.getElementById('fotoNovedad').files[0], function(b64Novedad) {
        try {
          let dictRespuestas = {};
          for (const cat in todasLasPreguntas) {
            const items = todasLasPreguntas[cat];
            for (const clave in items) {
              const elem = document.getElementById(clave);
              if (elem) dictRespuestas[clave] = elem.value;
            }
          }

          const registro = {
            id:         Date.now(),
            operador:   document.getElementById('operador').value.trim(),
            obra:       document.getElementById('obra').value,
            tipoActivo: document.getElementById('tipoActivo').value,
            placa:      document.getElementById('placa').value,
            estado:     document.getElementById('estado').value,
            novedades:  document.getElementById('novedadTexto').value.trim(),
            fotoHoro:   b64Horo,
            fotoNov:    b64Novedad,
            inspeccion: dictRespuestas,
            ...dictRespuestas
          };

          if (!registro.operador)   throw new Error('Debe ingresar el nombre del operador.');
          if (!registro.obra)       throw new Error('Debe seleccionar la obra.');
          if (!registro.tipoActivo) throw new Error('Debe seleccionar el tipo de activo.');
          if (!registro.placa)      throw new Error('Debe seleccionar el número de registro.');
          if (!registro.fotoHoro)   throw new Error('Debe tomar la foto del horómetro.');

          let locales = JSON.parse(localStorage.getItem('reg_maq') || '[]');
          locales.push(registro);
          localStorage.setItem('reg_maq', JSON.stringify(locales));

          document.getElementById('formularioOffline').reset();
          btn.innerText = "Guardar Inspección";
          btn.disabled  = false;
          mostrarPlacas();
          alert('¡Inspección guardada localmente!');
          actualizarEstado();

        } catch (error) {
          alert('Error al guardar datos: ' + error.message);
          btn.innerText = "Guardar Inspección";
          btn.disabled  = false;
        }
      });
    });
  });

  let sincronizando = false;

  async function sincronizarDatosGuardados() {
    if (!navigator.onLine || sincronizando) return;

    let locales = JSON.parse(localStorage.getItem('reg_maq') || '[]');
    if (locales.length === 0) return;

    sincronizando = true;

    try {
      const respuesta = await fetch(URL_APPS_SCRIPT, {
        method:   'POST',
        redirect: 'follow',
        headers:  { 'Content-Type': 'text/plain;charset=utf-8' },
        body:     JSON.stringify(locales[0])
      });

      const texto = await respuesta.text();
      let json;
      try { json = JSON.parse(texto); }
      catch(e) { json = { exito: false, error: 'Respuesta no JSON: ' + texto }; }

      if (json && json.exito) {
        let pendientes = JSON.parse(localStorage.getItem('reg_maq') || '[]');
        pendientes.shift();
        localStorage.setItem('reg_maq', JSON.stringify(pendientes));
        actualizarEstado();
        sincronizando = false;
        sincronizarDatosGuardados();
      } else {
        console.error('Servidor respondió con error:', json);
        sincronizando = false;
      }

    } catch (err) {
      console.error('Error al sincronizar:', err);
      sincronizando = false;
    }
  }

  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then(() => console.log('SW instalado correctamente'))
        .catch(err => console.error('Error registrando SW:', err));
    });
  }

  actualizarEstado();

</script>
</body>
</html>
