# agent/schemas.py
from typing import List, Dict, Any, Optional, Union
from pydantic import BaseModel, Field, model_validator

class Component(BaseModel):
    component_name: str
    component_type: str
    props: Optional[Dict[str, Any]] = Field(default_factory=dict)

    class Config:
        extra = "allow" # Allow other fields from the AI

    @model_validator(mode='before')
    def map_component_fields(self) -> 'Component':
        # Map various possible AI key names to our consistent schema
        if isinstance(self, dict):
            component_name = self.get('componentName') or self.get('name')
            if not component_name:
                raise ValueError("Component name is required. Please provide a 'componentName' or 'name' for each component.")
            self['component_name'] = component_name
            self['component_type'] = self.get('componentType') or self.get('type') or 'generic'
        return self

class Section(BaseModel):
    section_name: str
    components: List[Component] = Field(default_factory=list)

    class Config:
        extra = "allow"

    @model_validator(mode='before')
    def map_section_fields(self) -> 'Section':
        if isinstance(self, dict):
            self['section_name'] = self.get('sectionName') or self.get('name') or f"Section_{self.get('id', 'unknown')}"
        return self

class Page(BaseModel):
    id: str
    page_name: str
    page_path: str
    sections: List[Section] = Field(default_factory=list)

    class Config:
        extra = "allow"

    @model_validator(mode='before')
    def map_page_fields(self) -> 'Page':
        if isinstance(self, dict):
            self['page_name'] = self.get('pageName') or self.get('name') or f"Page_{self.get('id', 'unknown')}"
            path = self.get('pagePath') or self.get('path') or self.get('urlSlug') or f"/{self['page_name'].lower().replace(' ', '-')}"
            self['page_path'] = path if path.startswith('/') else f"/{path}"
            # Generate an ID if it doesn't exist
            self['id'] = self.get('id') or self.get('pageId') or self['page_name'].lower().replace(' ', '-')
        return self

class SiteBlueprint(BaseModel):
    client_name: str
    pages: List[Page] = Field(default_factory=list)
    design_system: Optional[Dict[str, Any]] = Field(None)

    class Config:
        extra = "allow"

    @model_validator(mode='before')
    def map_site_fields(self) -> 'SiteBlueprint':
        if isinstance(self, dict):
            self['client_name'] = self.get('client_name') or self.get('name') or self.get('siteName') or self.get('company_name') or "Unknown"
        return self
