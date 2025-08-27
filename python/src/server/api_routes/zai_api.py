from fastapi import APIRouter, HTTPException
from typing import Dict, Any

from ..services.zai_integration_service import ZAIIntegration, ZAIAnalysisResult
from ..services.zai_placeholder_dependencies import MeshNetwork, Consensus, Ledger

router = APIRouter(prefix="/api/zai", tags=["zai"])

# --- Service Instantiation ---
# In a real application, these might be managed by a dependency injection system.
# For now, we create singleton instances here.

try:
    mesh_network = MeshNetwork()
    consensus = Consensus()
    ledger = Ledger()

    # Create a singleton instance of the ZAIIntegration service
    zai_service = ZAIIntegration(
        mesh_network=mesh_network,
        consensus=consensus,
        ledger=ledger
    )
    print("✅ ZAI API Service initialized successfully.")
except Exception as e:
    zai_service = None
    print(f"❌ Failed to initialize ZAI API Service: {e}")


# --- API Endpoints ---

@router.post("/analyze_telemetry", response_model=ZAIAnalysisResult)
async def analyze_telemetry(satellite_id: str, telemetry_data: Dict[str, Any]):
    """
    Analyzes telemetry data for a given satellite using the ZAI Integration Service.
    """
    if not zai_service:
        raise HTTPException(status_code=503, detail="ZAI Service is not available.")

    try:
        result = await zai_service.analyze_telemetry_with_zai(satellite_id, telemetry_data)
        return result
    except Exception as e:
        # In a real app, you'd have more specific error handling.
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")

@router.post("/generate_mission_plan", response_model=Dict[str, Any])
async def generate_mission_plan(mission_objective: Dict[str, Any], constraints: Dict[str, Any]):
    """
    Generates a mission plan using the ZAI Integration Service.
    """
    if not zai_service:
        raise HTTPException(status_code=503, detail="ZAI Service is not available.")

    try:
        plan = await zai_service.generate_mission_plan(mission_objective, constraints)
        return plan
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred: {str(e)}")
