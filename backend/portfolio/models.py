from django.db import models
from django.utils.text import slugify

class CreativeField(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class CreativeProfile(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(max_length=60, blank=True, null=False, unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    bio = models.TextField(max_length=250)
    creative_fields = models.ManyToManyField(CreativeField, related_name='profiles')
    skills = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.name)
            slug = base_slug
            counter = 1
            while CreativeProfile.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class PortfolioLink(models.Model):
    profile = models.ForeignKey(CreativeProfile, related_name='portfolio_links', on_delete=models.CASCADE)
    url = models.URLField()
    label = models.CharField(max_length=100, blank=True)  # Optional: "Website", "Instagram", etc.

    def __str__(self):
        return f"{self.profile.name} - {self.label or self.url}"

