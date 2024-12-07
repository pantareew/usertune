from django.db import models
from django.contrib.auth.models import User

class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE) #first_name,last_name,email are default fields in User model
    elderly = models.BooleanField(default=False)
    dyslexia = models.BooleanField(default=False)
    low_vision = models.BooleanField(default=False)
    diopter_value = models.DecimalField(max_digits=4, decimal_places=2, null=True, blank=True)
    color_blindness = models.CharField(max_length=50, null=True, blank=True)  # store selected color blindness type
  
    class Meta:
        db_table = 'backend_userprofile'

    def __str__(self):
        return self.user.email