import json

from rest_framework import serializers
from .models import CreativeProfile, CreativeField, PortfolioLink


class CreativeFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = CreativeField
        fields = ['id', 'name']


class PortfolioLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = PortfolioLink
        fields = ['url', 'label']


class CreativeProfileSerializer(serializers.ModelSerializer):
    slug = serializers.ReadOnlyField()
    portfolio_links = PortfolioLinkSerializer(many=True, read_only=True)
    creative_fields = serializers.PrimaryKeyRelatedField(queryset=CreativeField.objects.all(), many=True)

    class Meta:
        model = CreativeProfile
        fields = '__all__'
        extra_kwargs = {
            'profile_picture': {'required': False, 'allow_null': True}
        }

    def create(self, validated_data):
        request = self.context.get('request')

        portfolio_links_raw = request.data.get('portfolio_links_json')
        portfolio_links = json.loads(portfolio_links_raw) if portfolio_links_raw else []

        creative_fields = validated_data.pop('creative_fields', [])
        profile = CreativeProfile.objects.create(**validated_data)
        profile.creative_fields.set(creative_fields)

        for link in portfolio_links:
            PortfolioLink.objects.create(profile=profile, **link)

        return profile

    def to_representation(self, instance):
        """Customize output to include nested creative fields."""
        rep = super().to_representation(instance)
        rep['creative_fields'] = CreativeFieldSerializer(instance.creative_fields.all(), many=True).data
        return rep
