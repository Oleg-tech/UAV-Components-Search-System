# Generated by Django 5.0.4 on 2024-05-10 19:15

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('components_search', '0005_alter_usermassage_message_user_ip'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermassage',
            name='message_user_ip',
            field=models.CharField(blank=True, default=None, max_length=100, null=True),
        ),
    ]
