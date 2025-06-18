from django.urls import path
from . import views
from django.urls import path
from .views import CreativeProfileListCreateView, CreativeProfileDetailView, CreativeFieldListView, \
    CreativeProfileSlugView

urlpatterns = [
    path('profiles/', CreativeProfileListCreateView.as_view(), name='profile-list-create'),
    path('profiles/<int:pk>/', CreativeProfileDetailView.as_view(), name='profile-detail'),
    path('creative-fields/', CreativeFieldListView.as_view(), name='creative-field-list'),
    path('profiles/slug/<slug:slug>/', CreativeProfileSlugView.as_view(), name='profile-by-slug'),
]