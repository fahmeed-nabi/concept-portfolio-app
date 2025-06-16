from django.db import models

class CreativeField(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CreativeProfile(models.Model):
    name = models.CharField(max_length=100)
    profile_picture = models.ImageField(upload_to='profile_pictures/')
    bio = models.TextField()
    creative_fields = models.ManyToManyField(CreativeField, related_name='profiles')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class PortfolioLink(models.Model):
    profile = models.ForeignKey(CreativeProfile, related_name='portfolio_links', on_delete=models.CASCADE)
    url = models.URLField()
    label = models.CharField(max_length=100, blank=True)  # Optional: "Website", "Instagram", etc.

    def __str__(self):
        return f"{self.profile.name} - {self.label or self.url}"

