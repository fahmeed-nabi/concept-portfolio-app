from django.shortcuts import render
from rest_framework import generics
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import CreativeProfile
from .serializers import CreativeProfileSerializer

class CreativeProfileListCreateView(generics.ListCreateAPIView):
    queryset = CreativeProfile.objects.all().order_by('-created_at')
    serializer_class = CreativeProfileSerializer

    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['name']  # enables ?search=name-substring
    filterset_fields = ['creative_fields']  # enables ?creative_fields=1 or ?creative_fields=1&creative_fields=2


class CreativeProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CreativeProfile.objects.all()
    serializer_class = CreativeProfileSerializer

