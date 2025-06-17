from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.filters import SearchFilter
from django_filters.rest_framework import DjangoFilterBackend
from .models import CreativeProfile, CreativeField
from .serializers import CreativeProfileSerializer, CreativeFieldSerializer
from rest_framework.response import Response

class CreativeProfileListCreateView(generics.ListCreateAPIView):
    queryset = CreativeProfile.objects.all().order_by('-created_at')
    serializer_class = CreativeProfileSerializer

    filter_backends = [SearchFilter, DjangoFilterBackend]
    search_fields = ['name']
    filterset_fields = ['creative_fields']

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CreativeProfileDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = CreativeProfile.objects.all()
    serializer_class = CreativeProfileSerializer

class CreativeFieldListView(generics.ListAPIView):
    queryset = CreativeField.objects.all()
    serializer_class = CreativeFieldSerializer
