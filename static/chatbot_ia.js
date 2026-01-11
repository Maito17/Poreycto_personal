<!-- static/chatbot_ia.js -->
(function() {
    // Crear el botón flotante
    var btn = document.createElement('button');
    btn.id = 'ia-chatbot-btn';
    btn.innerHTML = '🤖 IA Ventas';
    btn.style.position = 'fixed';
    btn.style.bottom = '32px';
    btn.style.right = '32px';
    btn.style.zIndex = '9999';
    btn.style.background = '#6366f1';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '50px';
    btn.style.padding = '16px 24px';
    btn.style.fontWeight = 'bold';
    btn.style.boxShadow = '0 2px 12px rgba(0,0,0,0.15)';
    btn.style.cursor = 'pointer';
    document.body.appendChild(btn);

    // Crear el chat flotante (oculto por defecto)
    var chat = document.createElement('div');
    chat.id = 'ia-chatbot-box';
    chat.style.position = 'fixed';
    chat.style.bottom = '90px';
    chat.style.right = '32px';
    chat.style.width = '340px';
    chat.style.maxHeight = '420px';
    chat.style.background = 'white';
    chat.style.borderRadius = '18px';
    chat.style.boxShadow = '0 4px 24px rgba(0,0,0,0.18)';
    chat.style.display = 'none';
    chat.style.flexDirection = 'column';
    chat.style.overflow = 'hidden';
    chat.innerHTML = `
        <div style="background:#6366f1;color:white;padding:14px 18px;font-weight:bold;font-size:1.1rem;display:flex;align-items:center;justify-content:space-between;">
            <span>IA Ventas</span>
            <span id="ia-chatbot-close" style="cursor:pointer;font-size:1.3rem;">&times;</span>
        </div>
        <div id="ia-chatbot-messages" style="padding:14px;height:220px;overflow-y:auto;font-size:0.98rem;background:#f8fafc;"></div>
        <form id="ia-chatbot-form" style="display:flex;padding:10px 10px 10px 10px;background:#f3f4f6;gap:6px;">
            <input id="ia-chatbot-input" type="text" placeholder="Pregunta sobre ventas..." style="flex:1;padding:8px 12px;border-radius:8px;border:1px solid #d1d5db;outline:none;" required />
            <button type="submit" style="background:#6366f1;color:white;border:none;border-radius:8px;padding:8px 14px;font-weight:bold;">Enviar</button>
        </form>
    `;
    document.body.appendChild(chat);

    // Mostrar/ocultar chat
    btn.onclick = function() {
        chat.style.display = chat.style.display === 'none' ? 'flex' : 'none';
    };
    chat.querySelector('#ia-chatbot-close').onclick = function() {
        chat.style.display = 'none';
    };

    // Manejar envío de preguntas
    var form = chat.querySelector('#ia-chatbot-form');
    var input = chat.querySelector('#ia-chatbot-input');
    var messages = chat.querySelector('#ia-chatbot-messages');
    form.onsubmit = function(e) {
        e.preventDefault();
        var pregunta = input.value.trim();
        if (!pregunta) return;
        messages.innerHTML += `<div style='margin-bottom:8px;'><b>Tú:</b> ${pregunta}</div>`;
        input.value = '';
        messages.innerHTML += `<div id='ia-typing' style='color:#6366f1;margin-bottom:8px;'>IA está escribiendo...</div>`;
        messages.scrollTop = messages.scrollHeight;
        fetch('/api/ia-ventas/', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({pregunta: pregunta})
        })
        .then(r => r.json())
        .then(data => {
            document.getElementById('ia-typing').remove();
            if (data.respuesta) {
                messages.innerHTML += `<div style='margin-bottom:12px;'><b>IA:</b> ${data.respuesta}</div>`;
            } else {
                messages.innerHTML += `<div style='color:red;margin-bottom:12px;'><b>IA:</b> Error: ${data.error || 'No se pudo obtener respuesta.'}</div>`;
            }
            messages.scrollTop = messages.scrollHeight;
        })
        .catch(() => {
            document.getElementById('ia-typing').remove();
            messages.innerHTML += `<div style='color:red;margin-bottom:12px;'><b>IA:</b> Error de conexión.</div>`;
            messages.scrollTop = messages.scrollHeight;
        });
    };
})();
