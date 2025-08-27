import pytest
from unittest.mock import patch, MagicMock, AsyncMock

# Since the ZAI SDK may not be installed in the test environment,
# we will patch the ZAI_AVAILABLE flag to test both scenarios.

def test_zai_integration_initialization_simulated():
    """
    Test that ZAIIntegration initializes in simulated mode when SDK is not available.
    """
    with patch('src.server.services.zai_integration_service.ZAI_AVAILABLE', False):
        from src.server.services.zai_integration_service import ZAIIntegration
        from src.server.services.zai_placeholder_dependencies import MeshNetwork, Consensus, Ledger

        service = ZAIIntegration(MeshNetwork(), Consensus(), Ledger())
        assert service.zai is None
        # The user's code had "simulado", let's check for that or a reasonable alternative
        assert "simulado" in service.model_info or "simulated" in service.model_info or "não disponível" in service.model_info


import pytest
from unittest.mock import patch
from src.server.services.zai_integration_service import ZAI

@patch('src.server.services.zai_integration_service.ZAI_AVAILABLE', True)
def test_zai_integration_initialization_sdk_error():
    """
    Test that ZAIIntegration handles an error during SDK initialization gracefully.
    Skips if ZAI SDK is not installed in the test environment.
    """
    if ZAI is None:
        pytest.skip("Skipping SDK error test: ZAI SDK not installed.")

    with patch.object(ZAI, 'create', side_effect=Exception("SDK Auth Error")) as mock_create:
        from src.server.services.zai_integration_service import ZAIIntegration
        from src.server.services.zai_placeholder_dependencies import MeshNetwork, Consensus, Ledger

        service = ZAIIntegration(MeshNetwork(), Consensus(), Ledger())
        mock_create.assert_called_once()
        assert service.zai is None
        assert "Erro de inicialização" in service.model_info

@pytest.mark.asyncio
async def test_analyze_telemetry_fallback_mode():
    """
    Test the analyze_telemetry_with_zai method in fallback (simulated) mode.
    """
    with patch('src.server.services.zai_integration_service.ZAI_AVAILABLE', False):
        from src.server.services.zai_integration_service import ZAIIntegration
        from src.server.services.zai_placeholder_dependencies import MeshNetwork, Consensus, Ledger

        service = ZAIIntegration(MeshNetwork(), Consensus(), Ledger())

        telemetry_data = {"battery_level": 25, "temperature": 50}
        result = await service.analyze_telemetry_with_zai("satellite-01", telemetry_data)

        assert result.anomaly_detected is True
        assert result.anomaly_type == "low_battery"
        assert result.model_used == "fallback_model"
        assert result.confidence == 0.7

@pytest.mark.asyncio
async def test_generate_mission_plan_fallback_mode():
    """
    Test the generate_mission_plan method in fallback (simulated) mode.
    """
    with patch('src.server.services.zai_integration_service.ZAI_AVAILABLE', False):
        from src.server.services.zai_integration_service import ZAIIntegration
        from src.server.services.zai_placeholder_dependencies import MeshNetwork, Consensus, Ledger

        service = ZAIIntegration(MeshNetwork(), Consensus(), Ledger())

        mission_objective = {"name": "Test Mission"}
        constraints = {"max_budget": 1000}
        plan = await service.generate_mission_plan(mission_objective, constraints)

        assert plan["status"] == "fallback_generated"
        assert plan["mission_name"] == "Test Mission"

# API Endpoint Tests

def test_analyze_telemetry_endpoint(client):
    """
    Test the POST /api/zai/analyze_telemetry endpoint in simulated mode.
    """
    # We patch the service instance within the API module
    with patch('src.server.api_routes.zai_api.zai_service', new_callable=MagicMock) as mock_service:
        from src.server.services.zai_integration_service import ZAIAnalysisResult
        # Configure the mock's async method to return a real ZAIAnalysisResult instance
        mock_result = ZAIAnalysisResult(
            anomaly_detected=False,
            model_used="test_model",
            anomaly_type=None,
            urgency_level=0,
            recommended_action="normal_operation",
            confidence=0.99,
            reasoning="Test reasoning",
            processing_time=0.123
        )

        mock_service.analyze_telemetry_with_zai = AsyncMock(return_value=mock_result)

        response = client.post(
            "/api/zai/analyze_telemetry?satellite_id=api-test-sat",
            json={"battery_level": 99, "temperature": 25}
        )

        assert response.status_code == 200
        data = response.json()
        assert data["anomaly_detected"] is False
        assert data["model_used"] == "test_model"

def test_generate_mission_plan_endpoint(client):
    """
    Test the POST /api/zai/generate_mission_plan endpoint.
    """
    with patch('src.server.api_routes.zai_api.zai_service', new_callable=MagicMock) as mock_service:
        mock_service.generate_mission_plan = AsyncMock(
            return_value={"status": "plan_generated_by_mock"}
        )

        response = client.post(
            "/api/zai/generate_mission_plan",
            json={
                "mission_objective": {"name": "API Test"},
                "constraints": {"duration": "30d"}
            }
        )

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "plan_generated_by_mock"
