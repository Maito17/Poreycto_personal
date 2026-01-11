import os
import json
import google.generativeai as genai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST

# Configuración: intenta leer desde el entorno
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

@csrf_exempt
@require_POST
def ia_ventas(request):
    try:
        if not GEMINI_API_KEY:
            return JsonResponse({'error': 'Falta la API Key de Gemini'}, status=500)

        data = json.loads(request.body)
        pregunta = data.get('pregunta', '')

        # Configuramos el modelo Gemini 1.5 Flash
        model = genai.GenerativeModel('gemini-1.5-flash')
        
        # Agregamos el contexto de experto en ventas
        prompt_completo = f"Eres un asistente experto en ventas para un sistema POS. Pregunta: {pregunta}"
        
        response = model.generate_content(prompt_completo)
        
        return JsonResponse({'respuesta': response.text})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
