# agent/schemas.py
from pydantic import BaseModel, Field
from pydantic.alias_generators import AliasChoices
from typing import List, Optional

class Component(BaseModel):
    # This change tells Pydantic to accept 'componentName', 'name', OR 'component_name'
    # from the JSON and map it to the `component_name` attribute in our Python code.
    component_name: str = Field(validation_alias=AliasChoices('componentName', 'name', 'component_name'))
    component_type: str
    props: Optional[dict] = None

class Section(BaseModel):
    section_name: str
    components: List[Component]

class Page(BaseModel):
    id: str
    page_name: str
    page_path: str
    sections: List[Section]

class SiteBlueprint(BaseModel):
    client_name: str
    pages: List[Page]
    design_system: Optional[dict] = None
