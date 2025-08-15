# agent/schemas.py - Corrected with Aliases
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class Page(BaseModel):
    """Pydantic model for a single page in the site blueprint."""
    id: str = Field(..., alias='id')
    name: str = Field(..., alias='name', validation_alias='pageTitle')
    path: str = Field(..., alias='path', validation_alias='urlPath')
    description: Optional[str] = Field(None, alias='description')
    sections: Optional[List[Dict[str, Any]]] = Field(default_factory=list, alias='sections')

class SiteBlueprint(BaseModel):
    """Pydantic model for the entire site blueprint."""
    client_name: str = Field(..., alias='client_name', validation_alias='companyName')
    pages: List[Page]
    design_system: Optional[Dict[str, Any]] = Field(None, alias='design_system')

class Config:
    populate_by_name = True
