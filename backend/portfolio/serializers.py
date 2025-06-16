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
    creative_fields = serializers.PrimaryKeyRelatedField(
        many=True, queryset=CreativeField.objects.all()
    )
    portfolio_links = PortfolioLinkSerializer(many=True)
    profile_picture = serializers.ImageField(required=False)

    class Meta:
        model = CreativeProfile
        fields = [
            'id',
            'name',
            'profile_picture',
            'bio',
            'creative_fields',
            'portfolio_links',
            'created_at',
        ]
        read_only_fields = ['id', 'created_at']

    def create(self, validated_data):
        portfolio_links_data = validated_data.pop('portfolio_links', [])
        creative_fields = validated_data.pop('creative_fields', [])
        profile = CreativeProfile.objects.create(**validated_data)
        profile.creative_fields.set(creative_fields)

        for link_data in portfolio_links_data:
            PortfolioLink.objects.create(profile=profile, **link_data)
        return profile

    def to_representation(self, instance):
        """Customize output to include nested creative fields."""
        rep = super().to_representation(instance)
        rep['creative_fields'] = CreativeFieldSerializer(instance.creative_fields.all(), many=True).data
        return rep
