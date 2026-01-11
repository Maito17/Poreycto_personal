import openai
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
import json
import os

# Usa tu propia clave de OpenAI aquí o desde variables de entorno
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY', 'AQUI_TU_API_KEY')

PROMPT_BASE = (
    "Eres un asistente experto en ventas, estrategias comerciales, recuperación de clientes y análisis de mercado. "
    "Solo puedes responder preguntas relacionadas con ventas, marketing, promociones, estrategias de negocio y recuperación de mercado. "
    "No respondas preguntas fuera de ese ámbito. Sé claro, profesional y enfocado en ayudar a mejorar las ventas.\n"
)

@csrf_exempt
@require_POST
def ia_ventas(request):
    data = json.loads(request.body)
    pregunta = data.get('pregunta', '')
    if not pregunta:
        return JsonResponse({'error': 'Pregunta vacía'}, status=400)

    prompt = PROMPT_BASE + f"\nPregunta: {pregunta}\nRespuesta:"
    try:
        openai.api_key = OPENAI_API_KEY
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": PROMPT_BASE},
                {"role": "user", "content": pregunta}
            ],
            max_tokens=300,
            temperature=0.7
        )
        respuesta = response.choices[0].message['content'].strip()
        return JsonResponse({'respuesta': respuesta})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
