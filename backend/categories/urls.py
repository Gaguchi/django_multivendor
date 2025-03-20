from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    CategoryViewSet, AttributeGroupViewSet, 
    AttributeViewSet, AttributeOptionViewSet
)

router = DefaultRouter()
router.register('', CategoryViewSet, basename='category')
router.register('attribute-groups', AttributeGroupViewSet, basename='attribute-group')
router.register('attributes', AttributeViewSet, basename='attribute')
router.register('attribute-options', AttributeOptionViewSet, basename='attribute-option')

urlpatterns = router.urls
