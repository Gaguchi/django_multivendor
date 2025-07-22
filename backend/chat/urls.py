from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'rooms', views.ChatRoomViewSet, basename='chatroom')
router.register(r'messages', views.ChatMessageViewSet, basename='chatmessage')
router.register(r'participants', views.ChatParticipantViewSet, basename='chatparticipant')

urlpatterns = [
    path('api/', include(router.urls)),
]
