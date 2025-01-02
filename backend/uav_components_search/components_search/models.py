from django.utils import timezone
from django.db import models


class Shop(models.Model):
    shop_name = models.CharField(max_length=100, null=False, blank=False)
    logo = models.CharField(max_length=200, null=False, blank=False)
    created_at = models.DateTimeField(default=timezone.now, editable=False)
    last_tested_at = models.DateTimeField(default=None, editable=True)


class Currency(models.Model):
    currency_acronym = models.CharField(max_length=100, null=False, blank=False)
    currency_name = models.CharField(max_length=100, null=False, blank=False)
    current_rate = models.FloatField()
    last_updated_at = models.DateTimeField(default=None, editable=True)


class Component(models.Model):
    component_name = models.CharField(max_length=100, null=False, blank=False)
    component_company = models.CharField(max_length=100, null=False, blank=False)
    component_type = models.CharField(max_length=50, null=False, blank=False)
    component_parameters = models.JSONField(null=False, blank=False)


class UserMassage(models.Model):
    message_email = models.CharField(max_length=100, null=False, blank=False)
    message_user_ip = models.CharField(max_length=100, null=True, blank=True, default=None)
    message_text = models.CharField(max_length=250, null=False, blank=False)
    message_is_checked = models.BooleanField(default=False)
