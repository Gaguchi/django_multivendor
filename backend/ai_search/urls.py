from django.urls import path
from . import views

urlpatterns = [
    path('search/', views.ai_search, name='ai_search'),
    path('suggestions/', views.get_search_suggestions, name='search_suggestions'),
    path('analytics/', views.search_analytics, name='search_analytics'),
    path('health/', views.health_check, name='ai_search_health'),
]
