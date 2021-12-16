from django.urls import path
from . import views


urlpatterns = [
    path('dtd-interne', views.dtdInternal,name='dtdInterne'),
    path('dtd-externe', views.dtdExternal,name='dtdExtern'),
    path('schema', views.schema,name='schema'),
]