from django.db import models
from django.contrib.auth.models import User

from .helpers import generate_random_color


class Profile(models.Model):
    user = models.OneToOneField(User, related_name="profile", on_delete=models.CASCADE)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    color = models.CharField(max_length=10, null=True, blank=True)

    def __str__(self):
        return self.user.username

    def save(self, *args, **kwargs):
        if not self.color:
            self.color = generate_random_color()
        super().save(*args, **kwargs)
