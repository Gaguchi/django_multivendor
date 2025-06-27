from django.urls import path
from . import views

urlpatterns = [
    path('', views.regular_search, name='regular_search'),  # GET /api/search/?q=query
    path('ai/', views.ai_search, name='ai_search'),
    path('suggestions/', views.search_suggestions, name='search_suggestions'),
    path('analytics/', views.search_analytics, name='search_analytics'),
]
