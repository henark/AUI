import asyncio
import json
import time
from typing import Dict, List, Optional, Any
from dataclasses import dataclass
import numpy as np

# Importar ZAI SDK (assumindo instalação)
try:
    import zai_sdk as ZAI
    ZAI_AVAILABLE = True
except ImportError:
    ZAI = None  # Define ZAI as None if import fails
    ZAI_AVAILABLE = False
    print("⚠️  ZAI SDK não disponível. Usando modo simulado.")

@dataclass
class ZAIAnalysisResult:
    anomaly_detected: bool
    anomaly_type: Optional[str]
    urgency_level: int
    recommended_action: str
    confidence: float
    reasoning: str
    processing_time: float
    model_used: str

class ZAIIntegration:
    def __init__(self, mesh_network: Any, consensus: Any, ledger: Any):
        self.mesh = mesh_network
        self.consensus = consensus
        self.ledger = ledger

        # Inicializar ZAI SDK
        if ZAI_AVAILABLE:
            try:
                self.zai = ZAI.create()
                self.model_info = self._get_model_info()
                print(f"✅ ZAI SDK inicializado: {self.model_info}")
            except Exception as e:
                print(f"❌ Erro ao inicializar ZAI SDK: {e}")
                self.zai = None
                self.model_info = f"Erro de inicialização: {e}"
        else:
            self.zai = None
            self.model_info = "simulado"
            print("⚠️  Operando em modo simulado sem ZAI SDK")

        # Cache para respostas
        self.response_cache: Dict[str, Any] = {}
        self.cache_ttl = 300  # 5 minutos

        # Métricas de uso
        self.usage_metrics: Dict[str, Any] = {
            "total_requests": 0,
            "cache_hits": 0,
            "average_response_time": 0.0,
            "model_accuracy": 0.0
        }

    def _get_model_info(self) -> str:
        """Obtém informações do modelo ZAI"""
        if self.zai:
            try:
                # Testar capacidade básica
                test_response = self.zai.chat.completions.create(
                    messages=[{"role": "user", "content": "Test"}],
                    max_tokens=10
                )
                return f"Model: {test_response.model}, Tokens: {test_response.usage.total_tokens}"
            except Exception as e:
                return f"Erro ao obter informações: {e}"
        return "Modelo não disponível"

    def _get_from_cache(self, key: str) -> Optional[Any]:
        """Get item from cache if not expired."""
        if key in self.response_cache:
            item, timestamp = self.response_cache[key]
            if time.time() - timestamp < self.cache_ttl:
                return item
        return None

    def _store_in_cache(self, key: str, value: Any) -> None:
        """Store item in cache with timestamp."""
        self.response_cache[key] = (value, time.time())

    def _update_metrics(self, response_time: float) -> None:
        """Update usage metrics."""
        total_req = self.usage_metrics["total_requests"]
        avg_time = self.usage_metrics["average_response_time"]
        self.usage_metrics["average_response_time"] = (avg_time * total_req + response_time) / (total_req + 1)
        self.usage_metrics["total_requests"] += 1

    async def analyze_telemetry_with_zai(self, satellite_id: str, telemetry_data: Dict) -> ZAIAnalysisResult:
        """Analisa telemetria usando ZAI SDK"""
        start_time = time.time()

        # Verificar cache primeiro
        cache_key = f"telemetry_{satellite_id}_{hash(str(telemetry_data))}"
        cached_result = self._get_from_cache(cache_key)

        if cached_result:
            self.usage_metrics["cache_hits"] += 1
            return cached_result

        # Preparar prompt para ZAI
        prompt = self._build_telemetry_prompt(satellite_id, telemetry_data)

        try:
            if self.zai:
                # Usar ZAI SDK real
                response = self.zai.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.3,
                    max_tokens=500,
                    top_p=0.9,
                    frequency_penalty=0.1,
                    presence_penalty=0.1
                )

                result = self._parse_zai_response(response, satellite_id)
            else:
                # Modo simulado
                result = self._simulate_zai_response(prompt, satellite_id)

            # Atualizar métricas
            processing_time = time.time() - start_time
            result.processing_time = processing_time
            self._update_metrics(processing_time)

            # Armazenar em cache
            self._store_in_cache(cache_key, result)

            return result

        except Exception as e:
            print(f"❌ Erro na análise ZAI para {satellite_id}: {e}")
            return self._create_fallback_result(satellite_id, telemetry_data)

    def _build_telemetry_prompt(self, satellite_id: str, telemetry_data: Dict) -> str:
        """Constrói prompt otimizado para análise de telemetria"""
        return f"""
        Você é um sistema especialista em análise de telemetria de satélites.
        Analise os seguintes dados do satélite {satellite_id}:

        Dados de Telemetria:
        - Nível de Bateria: {telemetry_data.get('battery_level', 'N/A')}%
        - Temperatura: {telemetry_data.get('temperature', 'N/A')}°C
        - Eficiência Painel Solar: {telemetry_data.get('solar_panel_efficiency', 'N/A')}
        - Posição: {telemetry_data.get('position', 'N/A')}
        - Velocidade: {telemetry_data.get('velocity', 'N/A')}
        - Timestamp: {telemetry_data.get('timestamp', 'N/A')}

        Tarefas:
        1. Detecte anomalias nos sistemas
        2. Classifique o nível de urgência (1-10)
        3. Recomende ação específica
        4. Forneça confiança na análise (0-1)
        5. Explique seu raciocínio

        Formato de resposta JSON:
        {{
            "anomaly_detected": "boolean",
            "anomaly_type": "string",
            "urgency_level": "int",
            "recommended_action": "string",
            "confidence": "float",
            "reasoning": "string"
        }}
        """

    def _parse_zai_response(self, response: Any, satellite_id: str) -> ZAIAnalysisResult:
        """Parseia resposta do ZAI SDK"""
        try:
            # Extrair conteúdo da resposta
            content = response.choices[0].message.content

            # Tentar parsear como JSON
            result_data = json.loads(content)

            return ZAIAnalysisResult(
                anomaly_detected=result_data.get('anomaly_detected', False),
                anomaly_type=result_data.get('anomaly_type'),
                urgency_level=result_data.get('urgency_level', 0),
                recommended_action=result_data.get('recommended_action', 'normal_operation'),
                confidence=result_data.get('confidence', 0.0),
                reasoning=result_data.get('reasoning', ''),
                processing_time=0.0,  # Será calculado externamente
                model_used=response.model
            )

        except json.JSONDecodeError as e:
            print(f"❌ Erro ao parsear JSON do ZAI para {satellite_id}: {e}")
            return self._create_fallback_result(satellite_id, {{}})
        except Exception as e:
            print(f"❌ Erro inesperado ao processar resposta ZAI: {e}")
            return self._create_fallback_result(satellite_id, {{}})

    def _simulate_zai_response(self, prompt: str, satellite_id: str) -> ZAIAnalysisResult:
        """Simula resposta do ZAI quando SDK não está disponível"""
        # Lógica de simulação baseada em regras simples
        print(f"Simulating ZAI response for {satellite_id}")
        return self._create_fallback_result(satellite_id, {{}})

    def _create_fallback_result(self, satellite_id: str, telemetry_data: Dict) -> ZAIAnalysisResult:
        """Cria resultado de fallback quando ZAI não está disponível"""
        # Lógica de fallback simplificada
        battery = telemetry_data.get('battery_level', 100)
        temperature = telemetry_data.get('temperature', 20)

        anomaly_detected = battery < 30 or temperature > 80
        anomaly_type = "low_battery" if battery < 30 else "high_temperature" if temperature > 80 else None
        urgency_level = 8 if battery < 20 else 7 if temperature > 80 else 0
        recommended_action = "conserve_power" if battery < 30 else "cool_down" if temperature > 80 else "normal_operation"
        confidence = 0.7 if anomaly_detected else 0.9
        reasoning = "Análise baseada em regras predefinidas (modo fallback)"

        return ZAIAnalysisResult(
            anomaly_detected=anomaly_detected,
            anomaly_type=anomaly_type,
            urgency_level=urgency_level,
            recommended_action=recommended_action,
            confidence=confidence,
            reasoning=reasoning,
            processing_time=0.1,
            model_used="fallback_model"
        )

    async def generate_mission_plan(self, mission_objective: Dict, constraints: Dict) -> Dict:
        """Gera plano de missão usando ZAI"""
        prompt = f"""
        Como especialista em missões espaciais, gere um plano detalhado para:

        Objetivo da Missão: {mission_objective}
        Restrições: {constraints}

        O plano deve incluir:
        1. Fases da missão
        2. Recursos necessários
        3. Timeline estimada
        4. Riscos e mitigação
        5. Critérios de sucesso

        Formato: JSON estruturado
        """

        try:
            if self.zai:
                response = self.zai.chat.completions.create(
                    messages=[{"role": "user", "content": prompt}],
                    temperature=0.2,
                    max_tokens=1000
                )
                return json.loads(response.choices[0].message.content)
            else:
                return self._generate_fallback_mission_plan(mission_objective, constraints)
        except Exception as e:
            print(f"❌ Erro ao gerar plano de missão: {e}")
            return {{"error": str(e)}}

    def _generate_fallback_mission_plan(self, mission_objective: Dict, constraints: Dict) -> Dict:
        """Generates a fallback mission plan when ZAI is not available."""
        print("Generating fallback mission plan.")
        return {
            "mission_name": mission_objective.get("name", "Unnamed Mission"),
            "status": "fallback_generated",
            "phases": ["Phase 1: Launch", "Phase 2: Orbit", "Phase 3: De-orbit"],
            "resources": "Placeholder resources",
            "timeline": "365 days",
            "risks": "Unknown (fallback mode)",
            "success_criteria": "Successful deployment (fallback criteria)"
        }
