# agent/schemas.py
import uuid
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field, root_validator

class Component(BaseModel):
    component_name: str
    component_type: str
    props: Optional[Dict[str, Any]] = Field(default_factory=dict)

    class Config:
        extra = "allow" # Allow other fields from the AI

    @root_validator(pre=True)
    def map_component_fields(cls, values):
        # Map various possible AI key names to our consistent schema
        values['component_name'] = values.get('componentName') or values.get('name') or f"Component_{values.get('id', 'unknown')}"
        values['component_type'] = values.get('componentType') or values.get('type') or 'generic'
        return values

class Section(BaseModel):
    section_name: str
    components: List[Component] = Field(default_factory=list)

    class Config:
        extra = "allow"

    @root_validator(pre=True)
    def map_section_fields(cls, values):
        values['section_name'] = values.get('sectionName') or values.get('name') or f"Section_{values.get('id', 'unknown')}"
        return values

class Page(BaseModel):
    id: str
    name: str
    path: str
    sections: List[Section] = Field(default_factory=list)

    class Config:
        extra = "allow"

    @root_validator(pre=True)
    def map_page_fields(cls, values):
        # Map AI-generated fields to our consistent schema
        values['id'] = str(values.get('id') or values.get('page_id') or uuid.uuid4())
        values['name'] = values.get('name') or values.get('pageName') or values.get('page_name') or f"Page_{values['id']}"

        path_candidate = values.get('path') or values.get('pagePath') or values.get('page_path') or values.get('urlSlug')
        if not path_candidate:
            path_candidate = f"/{values['name'].lower().replace(' ', '-')}"

        values['path'] = path_candidate if path_candidate.startswith('/') else f"/{path_candidate}"
        return values

class SiteBlueprint(BaseModel):
    client_name: str
    pages: List[Page] = Field(default_factory=list)
    design_system: Optional[Dict[str, Any]] = Field(None)

    class Config:
        extra = "allow"

    @root_validator(pre=True)
    def map_site_fields(cls, values):
        values['client_name'] = values.get('client_name') or values.get('name') or values.get('siteName') or values.get('company_name') or "Unknown"
        return values
